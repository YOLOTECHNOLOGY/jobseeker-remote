/* eslint-disable camelcase */
import React from 'react'
import Content from './content'
import { fetchUserOwnDetailService } from 'store/services/users/fetchUserOwnDetail'
import { cookies } from 'next/headers'

const Chat = async props => {
    const accessToken = cookies().get('accessToken').value
    const userResponse = await fetchUserOwnDetailService({ accessToken })
    const userDetail = userResponse.data.data
    return <Content {...props} userDetail={userDetail} />
}

export default Chat
