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
  Popconfirm,
  Button,
} from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider'
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
  getMetadata,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage'
import { updateDocument } from '../../firebase/services'

const ModalStyled = styled(Modal)`
  .ant-avatar-lg {
    cursor: pointer;
    width: 80px;
    height: 80px;
    text-align: center;
    .ant-avatar-string {
      top: 23%;
      font-size: 30px;
    }
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
      width: 80px;
      height: 80px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-40px, 40px);
      .avatar,
      .ant-image {
      }
      .ant-image,
      .ant-image-mask {
        border-radius: 50%;
        overflow: hidden;
        perspective: 1px;
      }
      .avatar > .ant-avatar-string {
        font-size: 40px;
        top: 25%;
      }
      .ant-upload {
        z-index: 1200;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        position: relative;
        bottom: 25px;
        left: 60px;
      }
      .ant-upload.ant-upload-select-picture-card > .ant-upload {
        transform: translate(-60px, 25px);
      }
      .ant-image-mask-info {
        opacity: 0.5;
        font-size: 10px;
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
  const { userAccountVisible, setUserAccountVisible } = useContext(AppContext)
  const initialPhoto = useMemo(
    () => ({ photoURL: photoURL, file: null }),
    [photoURL]
  )
  const [form] = Form.useForm()
  const [isFieldChange, setIsFieldChange] = useState(false)
  const [popConfirmVisivle, setPopConfirmVisible] = useState(false)
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

  const handleUpdateAccount = () => {
    setIsFieldChange(false)
    popConfirmCancel()
    let flat = false
    if (form?.getFieldsValue()?.name) {
      const name = form?.getFieldsValue()?.name
      if (name.trim() !== displayName) {
        console.log('changed')
        updateProfile(auth.currentUser, {
          displayName: name.trim(),
        })
        flat = true
      }
    }
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
          openNotification(
            'topLeft',
            'Uploading...',
            'Upload is ' + progress + '% done'
          )
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
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
            flat = true
          })
        }
      )
    }
    flat && window.location.reload()
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
              <Image src={photo.photoURL} width={80} className='noselect' />
              <ImgCrop rotate onModalOk={handleCropOk}>
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
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
                  className='avatar-uploader'
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
            <Form.Item label='Name' name='name'>
              <Input
                maxLength={40}
                defaultValue={displayName}
                onChange={() => setIsFieldChange(true)}
              />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input defaultValue={email} disabled />
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