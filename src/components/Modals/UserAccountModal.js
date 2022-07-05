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
import './Modals.scss'

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
    user: { uid },
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
    changeUserAvt()
    changeUserName()
  }

  const popConfirmCancel = () => {
    setPopConfirmVisible(false)
  }
  const showPopConfirm = () => {
    setPopConfirmVisible(true)
  }

  return (
    <Modal
      className='user-account noselect'
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
      <div className='avt-wrapper'>
        <Image className='cover-photo' src={userInfo.coverPhotoURL}></Image>
        {photo.photoURL ? (
          <div className='circle-avt'>
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
          <div className='circle-avt'>
            <Avatar size='large' className='avatar noselect'>
              {userInfo?.displayName?.charAt(0)?.toUpperCase()}
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
    </Modal>
  )
}
