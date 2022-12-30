import React, { useState, useEffect } from 'react'
import { assign } from 'lodash-es'
import CommonPhrasesModal from './commonPhrasesModal'
import { list as getList } from 'helpers/interpreters/services/commonPhrases'
import CommonPhrasesEditModal from './commonPhrasesEditModal'
import CommonPhrasesEditListModal from './commonPhrasesEditListModal'
import CommonPhrasesCreateModal from './commonPhrasesCreateModal'
import CommonPhrasesDeleteModal from './commonPhrasesDeleteModal'

const CommonPhrases = (props: any) => {
    const { contextRef, loading, applicationId, userId } = props
    const [list, setList] = useState([])
    const [listLoading, setListLoading] = useState(false)
    const [init, setInit] = useState(true)
    useEffect(() => {
        if (init && userId) {
            getList().then(result => {
                setList(result.data.data)
            })
            setInit(false)
        }

    }, [userId])
    const context = {
        updateList(list) {
            setList(list)
        },
        setListLoading(loading) {
            setListLoading(loading)
        },
        updateCommonPhrases(list) {
            setList(list)
        }

    }
    contextRef.current = assign(contextRef.current, context)

    return <>
        <CommonPhrasesModal
            contextRef={contextRef}
            loading={loading}
            applicationId={applicationId}
            listLoading={listLoading}
            list={list}
        />
        <CommonPhrasesEditListModal
            contextRef={contextRef}
            loading={loading}
            applicationId={applicationId}
            listLoading={listLoading}
            list={list}
        />
        <CommonPhrasesEditModal
            contextRef={contextRef}
            loading={loading}
        />
        <CommonPhrasesDeleteModal
            contextRef={contextRef}
            loading={loading}
        />
        <CommonPhrasesCreateModal
            contextRef={contextRef}
            loading={loading}
        />
    </>
}

export default CommonPhrases