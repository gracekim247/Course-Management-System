import { useMemo, useState, useEffect } from "react";
import FormField from "@components/pure-form/form-field";
import {
  requiredStringSchema,
  requiredDateSchema,
  requiredNumberSchema,
  optionalStringSchema,
  optionalNumberSchema,
} from "@constants/pure-schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUpdateCourseMutation } from "@redux/apis/programs/leadership/course-api";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import FormIndexedSelectField from "@components/pure-form/select/form-indexed-select-field";
import * as yup from "yup";
import { useGetAllSchoolOptionsQuery } from "@redux/apis/admin/school-api";
import { fieldLabelProps } from "@constants/app/admin";
import { useSelector } from "react-redux";
import { getUser } from "@redux/selectors";
import FormDatePicker from "@components/pure-form/time/form-date-picker";
import { useNotifications } from "@contexts/notifications-provider";
import { useGetSchoolLiaisonQuery } from "@redux/apis/admin/liaison-api"


const schema = yup
  .object({
    course_code: requiredStringSchema,
    instructor_id: requiredNumberSchema,
    leadershiptype: optionalStringSchema,
    school_id: requiredNumberSchema,
    creator_id: requiredNumberSchema,
    updated_by_id: requiredNumberSchema,
    assignedby_id: requiredNumberSchema,
    status: requiredStringSchema,
    end_date: requiredDateSchema,
    start_date: requiredDateSchema,
    schedule: requiredStringSchema,
    primary_liaison_id: optionalNumberSchema,
    secondary_liaison_id: optionalNumberSchema,
    tertiary_liaison_id: optionalNumberSchema,
  })
  .required();

const updateCourseFormModal = ({ courseData }) => {
  const defaultValues = {
    course_code: courseData.course_code,
    instructor_id: 1,
    leadershiptype: courseData.leadershiptype,
    school_id: courseData.school_id,
    creator_id: courseData.creator_id,
    updated_by_id: courseData.updated_by_id,
    assignedby_id: courseData.assignedby_id,
    status: courseData.status,
    end_date: courseData.end_date,
    start_date: courseData.start_date,
    schedule: courseData.schedule,
    primary_liaison_id: courseData.primary_liaison_id,
    secondary_liaison_id: courseData.secondary_liaison_id,
    tertiary_liaison_id: courseData.tertiary_liaison_id,
  };

  const buttonStyle = {
    mb: 1, 
    mt: 2,
    size: "medium",
    width: "30%",
  }
  
  const mobileButtonStyle = {
    mb: 1, 
    mt: 2,
    size: "small",
    width: "100%",
  }

  const { notify } = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentSchool, setCurrentSchool] = useState<number>();
  useEffect(() => {
    if (courseData.school_id) {
      setCurrentSchool(courseData.school_id);
    }
  }, [courseData.school_id]);

  const [primaryLiaisonId, setPrimaryLiaisonId] = useState<number | null>(null);
  const [secondaryLiaisonId, setSecondaryLiaisonId] = useState<number | null>(null);
  const [tertiaryLiaisonId, setTertiaryLiaisonId] = useState<number | null>(null);

  const { id } = useSelector(getUser);
  const [updateCourse] = useUpdateCourseMutation();

  const {handleSubmit, control, reset, formState: { isDirty }} = useForm({
    defaultValues: {
      ...defaultValues,
      updated_by_id: id,
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const getChangedValues = (initialValues, currentValues) => {
    const changedValues = {};
    for (const key in currentValues) {
      if (currentValues[key] !== initialValues[key]) {
        changedValues[key] = currentValues[key];
      }
    }
    return changedValues;
  };

  const submit = handleSubmit(async (values) => {
    const changedValues = getChangedValues(defaultValues, values);
    if (Object.keys(changedValues).length === 0 || !isDirty) {
      notify("No Changes Made", "info");
    } else {
      try {
        await updateCourse({ id: courseData.id, ...changedValues })
          .unwrap()
          .then(() => {
            notify("Course Updated", "success");
            reset(values);
          });
      } catch (error) {
        console.error("Update failed: ", error);
        notify("Failed to update course", "error");
      }
    }
  });

  const { data: schoolOptions, isFetching: isLoadingOptions } =
    useGetAllSchoolOptionsQuery(undefined);

  const INDEXED_SCHOOL_OPTS = useMemo(() => {
    if (schoolOptions)
      return schoolOptions.map(({ id, name }) => ({
        key: id,
        value: name || `School ${id}`,
      }));
    return [];
  }, [schoolOptions]);

  const handleValueChange = (value: number) => {
    setCurrentSchool(value);
  };

  const { 
      data: liaisonSchoolOptions, 
      isLoading: isLoadingLiaisonSchoolOptions
    } = useGetSchoolLiaisonQuery( {school_id: currentSchool, permission: "l"}, {
      skip: !currentSchool,
    });
  
  const INDEXED_LIAISON_SCHOOL_OPTS = useMemo(() => {
    if (liaisonSchoolOptions && currentSchool !== undefined) {
      return liaisonSchoolOptions
        .map(option => ({
            key: option.liaison.id,
            value: option.liaison.user.preferred_name || `${option.liaison.user.first_name} ${option.liaison.user.last_name}` || `Liaison ${option.liaison.id}`,
          }));
    }
    return [];
  }, [liaisonSchoolOptions, currentSchool]);
  
  const handlePrimaryLiaisonChange = (selectedValue: string | number) => {
    const numericValue = typeof selectedValue === 'string' ? parseInt(selectedValue, 10) : selectedValue;
    setPrimaryLiaisonId(numericValue);
    console.log("courseData.primary_liaison_id: ", courseData.primary_liaison_id);
  };

  const handleSecondaryLiaisonChange = (selectedValue: string | number) => {
    const numericValue = typeof selectedValue === 'string' ? parseInt(selectedValue, 10) : selectedValue;
    setSecondaryLiaisonId(numericValue);
  };

  const handleTertiaryLiaisonChange = (selectedValue: string | number) => {
    const numericValue = typeof selectedValue === 'string' ? parseInt(selectedValue, 10) : selectedValue;
    setTertiaryLiaisonId(numericValue);
  };

  const FILTERED_SECONDARY_OPTIONS = INDEXED_LIAISON_SCHOOL_OPTS.filter(option => option.key !== Number(primaryLiaisonId) && option.key !== Number(tertiaryLiaisonId)) ;
  const FILTERED_TERTIARY_OPTIONS = INDEXED_LIAISON_SCHOOL_OPTS.filter(option => option.key !== Number(primaryLiaisonId) && option.key !== Number(secondaryLiaisonId));


  return (
      <Box width="auto" bgcolor="background.paper">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography id="modal-title" variant="h6" component="h2" fontWeight="800">
            Update Leadership Course
          </Typography>
        </Stack>
        <Box>
          <Stack spacing={2} sx={{mb: 2, mt: 2}}>

            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 4}  alignItems="center">
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px" >
                <FormField
                  variant="outlined"
                  control={control}
                  id="course_code"
                  label="Course Code"
                  separateLabel
                  minRows={1}
                  labelProps={fieldLabelProps}
                />
              </Stack>
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px">
                <FormField
                  control={control}
                  variant="outlined"
                  id="leadershiptype"
                  disabled
                  label="Leadership Type"
                  separateLabel
                  labelProps={fieldLabelProps}
                />
              </Stack>
            </Stack>

            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 4}  alignItems="center">
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px">
                <FormDatePicker
                  control={control}
                  id="start_date"
                  label="start date"
                  separateLabel
                  labelProps={fieldLabelProps}
                  pickerProps={{
                    disablePast: true,
                  }}
                />
              </Stack>
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px">
                <FormDatePicker
                  control={control}
                  id="end_date"
                  label="End Date"
                  separateLabel
                  labelProps={fieldLabelProps}
                  pickerProps={{
                    disablePast: true,
                  }}
                />
              </Stack>
            </Stack>

            {isLoadingOptions ? (
              <Typography component="em">Loading school options...</Typography>
            ) : (
              <FormIndexedSelectField
                control={control}
                id="school_id"
                options={INDEXED_SCHOOL_OPTS}
                label="Associated School"
                separateLabel
                labelProps={fieldLabelProps}
                onValueChange={handleValueChange} 
              />
            )}

            {isLoadingLiaisonSchoolOptions ? (
              <Typography component="em">Loading liaison options...</Typography>
            ) : (
              <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 4}  alignItems="center">
                <Stack width={isMobile ? "100%" : "33%"} minWidth="120px" >
                  <FormIndexedSelectField
                    control={control}
                    id="primary_liaison_id"
                    options={INDEXED_LIAISON_SCHOOL_OPTS.filter(option => option.key !== Number(secondaryLiaisonId) && option.key !== Number(tertiaryLiaisonId))}
                    label="Primary Liaison"
                    separateLabel
                    labelProps={fieldLabelProps}
                    onValueChange={handlePrimaryLiaisonChange}
                  />
                </Stack>
                <Stack width={isMobile ? "100%" : "33%"} minWidth="120px">
                  <FormIndexedSelectField
                    control={control}
                    id="secondary_liaison_id"
                    options={FILTERED_SECONDARY_OPTIONS}
                    label="Secondary Liaison" 
                    separateLabel
                    labelProps={fieldLabelProps}
                    onValueChange={handleSecondaryLiaisonChange}
                  />
                </Stack>
                <Stack width={isMobile ? "100%" : "33%"} minWidth="120px">
                  <FormIndexedSelectField
                    control={control}
                    id="tertiary_liaison_id"
                    options={FILTERED_TERTIARY_OPTIONS}
                    label="Tertiary Liaison"
                    separateLabel
                    labelProps={fieldLabelProps}
                    onValueChange={handleTertiaryLiaisonChange}
                    //value={tertiaryLiaisonId}
                  />
                </Stack>
              </Stack>
            )}
            <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 4}  alignItems="center">
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px">
                <FormField
                  variant="standard"
                  control={control}
                  id="schedule"
                  label="Schedule"
                  minRows={1}
                />
              </Stack>
              <Stack width={isMobile ? "100%" : "50%"} minWidth="120px">
                <FormField
                  variant="standard"
                  control={control}
                  id="status"
                  label="Status"
                  multiline
                  minRows={1}
                />
              </Stack>
            </Stack>
          </Stack>
          <Box 
            display= "flex"
            justifyContent= "center"
            alignItems= "center"  
          >
            <Button 
            variant="contained" 
            sx={ isMobile ? mobileButtonStyle : buttonStyle} 
            onClick={submit} 
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
  );
};

export default updateCourseFormModal;
