/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { deleteOne, list, update, create } from './services/commonPhrases'
const { utils, commonPhrases: {
    ModalActions,
    EditListActions,
    EditOneActions,
    CreateOneActions,
    DeleteOneActions
} } = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalCommonPhrases: () => M(context => new Promise(resolve =>
        context.showCommonPhrases({
            close: () => resolve(ModalActions.close),
            send: payload => resolve(ModalActions.send(payload)),
            modalEditList: () => resolve(ModalActions.modalEditList),
            modalCreate: () => resolve(ModalActions.modalCreate)
        }))),
    modalEditList: () => M(context => new Promise(resolve => {
        context.showEditCommonPhrasesList({
            back: () => resolve(EditListActions.back),
            editOne: payload => resolve(EditListActions.editOne(payload)),
            deleteOne: payload => resolve(EditListActions.deleteOne(payload)),
        })
    })),
    modalEdit: payload => M(context => new Promise(resolve =>
        context.showEditOneCommonPhrases({
            back: () => resolve(EditOneActions.back),
            save: payload => resolve(EditOneActions.save(payload)),
            payload
        }))),

    modalCreate: () => M(context => new Promise(resolve =>
        context.showCreateOneCommonPhrases({
            back: () => resolve(CreateOneActions.back),
            save: payload => resolve(CreateOneActions.save(payload.params)),
        }))),
    modalDeleteConfirm: payload => M(context => new Promise(resolve =>
        context.showDeleteOneCommonPhrases({
            back: () => resolve(DeleteOneActions.back),
            delete: payload => resolve(DeleteOneActions.delete(payload)),
            payload: payload
        }))),

    updateList: payload => M(context => new Promise(resolve => {
        context?.updateCommonPhrases(payload)
        resolve()
    })),

    requestList: () => M(context => {
        context.setLoading(true)
        return list()
            .then(result => RequestResult.success(result?.data?.data))
            .catch(e => RequestResult.error(e))
            .finally(() => context.setLoading(false))
    }),
    requestCreate: (params) => M(context => {
        context.setLoading(true)
        return create(params)
            .then(result => RequestResult.success(result))
            .catch(e => RequestResult.error(e))
            .finally(() => context.setLoading(false))
    }),
    requestUpdate: payload => M(context => {
        context.setLoading(true)
        return update(payload.id, payload.params)
            .then(result => RequestResult.success(result))
            .catch(e => RequestResult.error(e))
            .finally(() => context.setLoading(false))
    }),

    requestDelete: payload => M(context => {
        context.setLoading(true)
        return deleteOne(payload.id, payload.params)
            .then(result => RequestResult.success(result))
            .catch(e => RequestResult.error(e))
            .finally(() => context.setLoading(false))
    })
})