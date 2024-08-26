import IdPayload from "@server/type/misc/id-payload";
import rootApi from "../../root-api";
import { LEADERSHIP_APP_TAG } from "../../tag-types";
import Course from "@server/type/program/leadership-course/courses";
import Liaison from "@server/type/user/liaison";


type CoursePayload = {
  course_code: string;
  instructor_id: number;
  leadershiptype: string;
  school_id: number;
  creator_id: any;
  updated_by_id: any;
  assignedby_id: any;
  status: string;
  end_date: string;
  start_date: string;
  schedule: string;
  primary_liaison_id: number | null;
  secondary_liaison_id: number | null;
  tertiary_liaison_id:  number | null;
  primary_liaison: Liaison | null;
  secondary_liaison?: Liaison | null;
  tertiary_liaison?: Liaison | null;
};

export const CourseApi = rootApi.injectEndpoints({
  endpoints: (build) => ({
    getCourse: build.query<Course[], undefined>({
      query: () => "/programs/le/all",
      providesTags: [{ type: LEADERSHIP_APP_TAG, id: "ALL" }],
    }),
    getOneCourse: build.query<Course, IdPayload>({
      query: (id) => `/programs/le/${id}`,
      providesTags: (data, error, id) => {
        if (error) return [];
        return [{ type: LEADERSHIP_APP_TAG, id: `${id}` }];
      },
    }),
    createCourse: build.mutation<Course, CoursePayload>({
      query: (body) => {
        console.log("Body values:", body); // Log the body values
        return {
          url: "/programs/le/send",
          method: "POST",
          body,
        };
      },
      invalidatesTags: (data, error, arg) => {
        if (error) return [];
        return [LEADERSHIP_APP_TAG];
      },
    }),
    
    updateCourse: build.mutation<Course, { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/programs/le/${id}`,
        method: "PUT",
        body: {...body},
      }),
      invalidatesTags: (result, error, { id }) => {
        if (error) return [];
        return [{ type: LEADERSHIP_APP_TAG, id }];
      },
    }),
  }),
});

export const {
  useGetCourseQuery,
  useGetOneCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} = CourseApi;
