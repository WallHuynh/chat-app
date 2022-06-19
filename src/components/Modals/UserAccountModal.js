import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Modal,
  Image,
  Avatar,
  Form,
  Input,
  Upload,
  notification,
  message,
  Button,
} from 'antd'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import styled from 'styled-components'
import {
  CameraFilled,
  CheckOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons'
import { updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/config'
import ImgCrop from 'antd-img-crop'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { generateKeywords, updateDocument } from '../../firebase/services'

const ModalStyled = styled(Modal)`
  .ant-avatar-lg {
    cursor: pointer;
    width: 100px;
    height: 100px;
    text-align: center;
  }
  .ant-modal-body {
    max-height: 330px;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 2px;
      background: rgba(0, 0, 0, 0);
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0.2px;
    }
  }
  .ant-modal-footer {
    height: 50px;
    text-align: center;
    .disabled-btn {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
      border: 0.1px solid;
      background: #f5f5f5;
      text-shadow: none;
      box-shadow: none;
    }
    .confirm-btn {
      border: 0.1px solid green;
      background-color: white;
      font-weight: 600;
      color: green;
      :hover {
        font-weight: 600;
        border: solid 1px green;
        color: green;
      }
      :active {
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
          rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
          rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
        transform: translateY(-0.5px);
        transition: 200ms;
      }
    }
  }
  .cover-photo {
    background-color: lightpink;
    height: 150px;
    position: relative;
    .cover-avt {
      border-radius: 50%;
      width: 100px;
      height: 100px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      :hover {
        .ant-upload {
          display: flex;
        }
      }
      .avatar,
      .image-avt {
        border: 3px solid white;
      }
      .ant-image,
      .ant-image-mask {
        border-radius: 50%;
        overflow: hidden;
        perspective: 1px;
      }
      .avatar > .ant-avatar-string {
        font-size: 50px;
        top: 28%;
      }
      .ant-upload {
        display: none;
        z-index: 1200;
        width: 25px;
        height: 25px;
        background-color: lightgreen;
        border-radius: 50%;
        position: relative;
        bottom: 30px;
        left: 70px;
        :hover {
          display: flex;
        }
      }
      .ant-upload.ant-upload-select-picture-card > .ant-upload {
        transform: translate(-70px, 29px);
      }
      .ant-image-mask-info {
        opacity: 0.5;
        font-size: 8px;
      }
    }
  }
  .info {
    margin: 0 30px 30px 30px;
    height: 180px;
    padding-top: 45px;
    .name {
      background-color: lightgreen;
      font-size: 25px;
      text-align: center;
      padding: 0 40px 0 40px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }
    .email {
      padding: 0 20px 0 20px;
      font-size: 16px;
      .tag {
        opacity: 0.7;
      }
    }
  }
`
const ModalConfirmStyled = styled(Modal)`
  .ant-modal-body {
    display: none;
  }
`

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  return isJpgOrPng
}

export default function UserAccountModal() {
  const {
    user: { email, displayName, photoURL, uid },
  } = useContext(AuthContext)
  const { userAccountVisible, setUserAccountVisible, userInfo } =
    useContext(AppContext)
  const [form] = Form.useForm()
  const [isFieldChange, setIsFieldChange] = useState(false)
  const [popConfirmVisivle, setPopConfirmVisible] = useState(false)
  const initialPhoto = useMemo(
    () => ({ photoURL: userInfo.photoURL, file: null }),
    [userInfo.photoURL]
  )
  const [photo, setPhoto] = useState(initialPhoto)

  useEffect(() => {
    setPhoto(initialPhoto)
  }, [initialPhoto])

  const handleChange = info => {
    const file = info.file.originFileObj
    const reader = new FileReader()
    reader.addEventListener('load', () =>
      setPhoto(prev => ({ ...prev, photoURL: reader.result }))
    )
    reader.readAsDataURL(file)
  }

  const openNotification = (placement, msg, describe, duration = 3) => {
    notification.warn({
      message: msg,
      description: describe,
      placement: placement,
      duration: duration,
    })
  }

  const handleCancel = () => {
    setPhoto(initialPhoto)
    setIsFieldChange(false)
    setPopConfirmVisible(false)
    form.resetFields()
    setUserAccountVisible(false)
  }

  const handleCropOk = file => {
    setIsFieldChange(true)
    setPhoto(prev => ({ ...prev, file: file }))
  }

  const changeUserName = () => {
    if (form?.getFieldsValue()?.name) {
      const name = form?.getFieldsValue()?.name
      console.log(name)
      if (name.trim() !== userInfo.displayName) {
        const newName = name.trim()
        updateDocument('users', uid, {
          displayName: newName,
          keywords: generateKeywords(newName),
        })
        updateProfile(auth.currentUser, {
          displayName: newName,
        })
        openNotification(
          'topLeft',
          'Update name successfully',
          `Your new name is ${newName}`
        )
        return ' change name successfully'
      } else {
        return
      }
    } else {
      return
    }
  }

  const changeUserAvt = () => {
    if (photo.file) {
      const storageRef = getStorage()
      const userAvatarRef = ref(
        storageRef,
        `user-avatars/${uid}/${photo.file.name}`
      )
      const uploadTask = uploadBytesResumable(userAvatarRef, photo.file)
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
        },
        error => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            console.log('File available at', downloadURL)
            updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            })
            updateDocument('users', uid, {
              photoURL: downloadURL,
            })
            openNotification('topLeft', 'Update complete!', '')
            return 'change avt successfully'
          })
        }
      )
    } else {
      return
    }
  }

  const handleUpdateAccount = () => {
    setIsFieldChange(false)
    popConfirmCancel()

    new Promise(function (resolve, reject) {
      setTimeout(() => resolve(changeUserAvt()))
    })
      .then(function (result) {
        console.log(result)
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(changeUserName()))
        })
      })
      .then(function (result) {
        console.log(result)
      })
  }

  const popConfirmCancel = () => {
    setPopConfirmVisible(false)
  }
  const showPopConfirm = () => {
    setPopConfirmVisible(true)
  }

  return (
    <div>
      <ModalStyled
        centered
        footer={
          isFieldChange ? (
            <Button
              className='confirm-btn noselect'
              disabled={!isFieldChange}
              onClick={showPopConfirm}>
              <CheckOutlined /> Update
            </Button>
          ) : (
            <Button
              className={'disabled-btn'}
              disabled={!isFieldChange}
              onClick={showPopConfirm}>
              <CheckOutlined /> Update
            </Button>
          )
        }
        bodyStyle={{ padding: '0' }}
        width={350}
        title='User account setting'
        visible={userAccountVisible}
        onCancel={handleCancel}>
        <div className='cover-photo'>
          {photo.photoURL ? (
            <div className='cover-avt'>
              <Image
                src={photo.photoURL}
                width={100}
                rootClassName='image-avt'
                className='noselect'
              />
              <ImgCrop rotate onModalOk={handleCropOk}>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}>
                  {<CameraFilled />}
                </Upload>
              </ImgCrop>
            </div>
          ) : (
            <div className='cover-avt'>
              <Avatar size='large' className='avatar noselect'>
                {displayName?.charAt(0)?.toUpperCase()}
              </Avatar>

              <ImgCrop rotate onModalOk={handleCropOk}>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}>
                  {<CameraFilled />}
                </Upload>
              </ImgCrop>
            </div>
          )}
        </div>

        <div className='info'>
          <Form form={form} layout='vertical'>
            <Form.Item
              label='Name'
              name='name'
              initialValue={userInfo.displayName}>
              <Input maxLength={40} onChange={() => setIsFieldChange(true)} />
            </Form.Item>
            <Form.Item label='Email' name='email' initialValue={userInfo.email}>
              <Input disabled />
            </Form.Item>
          </Form>
        </div>
        <ModalConfirmStyled
          visible={popConfirmVisivle}
          placement='topLeft'
          onOk={handleUpdateAccount}
          onCancel={popConfirmCancel}
          centered
          title={
            <>
              <ExclamationCircleTwoTone twoToneColor='#ff5500' />{' '}
              {'Are you sure to update your profile?'}
            </>
          }
          width={300}
          okText='Yes'
          cancelText='No'
          closable={false}></ModalConfirmStyled>
      </ModalStyled>
    </div>
  )
}
