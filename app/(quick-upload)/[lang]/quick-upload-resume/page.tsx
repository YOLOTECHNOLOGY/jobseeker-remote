/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import QuickUploadResume from './quickUploadResume'
import { getDictionary } from 'get-dictionary'

export default async function (props) {
    const { lang } = props.params
    const dic = await getDictionary(lang)
    return <QuickUploadResume lang={dic}></QuickUploadResume>
}