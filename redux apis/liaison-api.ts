import IdPayload from "@server/type/misc/id-payload"
import rootApi from "../../root-api"
import { ADMIN_LIAISON_TAG } from "../../tag-types"
import { SpecificLiaison, TableLiaison } from "./config"

export const liaisonApi = rootApi.injectEndpoints({
    endpoints: (build) => ({
        getLiaisons: build.query<TableLiaison[], undefined>({
            query: () => "/admin/views/liaisons",
            providesTags: (data, error) => {
                if (error)
                    return []
                return [{ type: ADMIN_LIAISON_TAG, id: "ALL" }]
            }
        }),
        getSpecificLiaison: build.query<SpecificLiaison, IdPayload>({
            query: (liaisonId) => `/admin/records/liaison/${liaisonId}`,
            providesTags: (data, error, arg) => {
                if (error)
                    return []
                return [{ type: ADMIN_LIAISON_TAG, id: `${arg}` }]
            }
        }),

        getSchoolLiaison: build.query({
            query: ({school_id, permission}) => ({
                url: `/admin/school/liaison/${school_id}/${permission}`,
                method: "GET",
            }),
        }),
    })
})

export const {
    useGetLiaisonsQuery,
    useGetSpecificLiaisonQuery,
    useGetSchoolLiaisonQuery,
} = liaisonApi
