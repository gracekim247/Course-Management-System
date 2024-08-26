import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { getUser } from "@redux/selectors";
import FormField from "../components pure-form/form-field";
import FormDatePicker from "@components/pure-form/time/form-date-picker";
import FormIndexedSelectField from "../components pure-form/form-indexed-select-field";
import { fieldLabelProps } from "@constants/app/admin";
import { useNotifications } from "@contexts/notifications-provider";
import moment from "moment";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal,Box, Typography, Button, Stack, IconButton, TextField } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useCreateCourseMutation } from "../redux apis/course-api";
import { useGetAllSchoolOptionsQuery } from "@redux/apis/admin/school-api";
import { useGetSchoolLiaisonQuery } from "../redux apis/liaison-api"

const optionalStringSchema = yup
  .mixed()
  .nullable()
  .transform((val) => val ?? "")
  .transform((val) => val.trim());

const requiredStringSchema = optionalStringSchema.test(
  "mixed-required",
  "Field is required.",
  (val) => {
    return val ? `${val}`.trim().length > 0 : false;
  }
);

const requiredNumberSchema = yup.number().required("Field is required.");

const optionalNumberSchema = yup
  .number()
  .nullable();

const requiredDateSchema = yup
  .mixed()
  .test("required", "A valid date is required.", (value) =>
    moment(value).isValid()
  );

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  paddingRight: 2.5,
};

const mobileStyle = {
  width: "80%",
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

const styleScroll = {
  padding: 1,
  paddingRight: 1.5,
  maxHeight: 450,
  overflow:"auto",
  overflowY:"scroll",
}

const mobileStyleScroll = {
  maxHeight: 300,
  overflow:"auto",
  overflowY:"scroll",
}

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


const FormModal = ({ open, onClose, leadership_type }) => {

  const defaultValues = {
    course_code: "",
    instructor_id: 1,
    leadershiptype: leadership_type,
    school_id: 0,
    creator_id: "",
    updated_by_id: "",
    assignedby_id: "",
    status: "",
    end_date: "",
    start_date: "",
    schedule: "",
    primary_liaison_id: null,
    secondary_liaison_id: null,
    tertiary_liaison_id: null,
  };

  const { notify } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentSchool, setCurrentSchool] = useState<number>();
  const [primaryLiaisonId, setPrimaryLiaisonId] = useState<number | null>(null);
  const [secondaryLiaisonId, setSecondaryLiaisonId] = useState<number | null>(null);
  const [tertiaryLiaisonId, setTertiaryLiaisonId] = useState<number | null>(null);

  const { id } = useSelector(getUser);

  const [createCourse, { isLoading: createCourseLoading }] =
    useCreateCourseMutation();
        
 const { handleSubmit, control, reset, formState: { isDirty }, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      creator_id: id,
      updated_by_id: id,
      assignedby_id: id,
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const submit = handleSubmit(async (values) => {
    await createCourse(values)
      .unwrap()
      .then(() => {
        notify("Course Created ", "success");
      });
    reset(defaultValues);
    onClose();
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
    <Modal
      disableEnforceFocus
      open={open}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
    >
      <Box sx={isMobile ? mobileStyle : style}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography id="modal-title" variant={isMobile ? "subtitle1" : "h6"} component="h2" fontWeight="700">
            Create Leadership Course
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box
          sx={isMobile ? mobileStyleScroll : styleScroll}
        >
          <Stack spacing={2} sx={{ mt: 0}}>
            <Stack spacing={3}>
              <FormField
                variant="standard"
                control={control}
                id="course_code"
                label="Course Code"
                minRows={1}
              />
              <FormField
                control={control}
                id="leadershiptype"
                disabled
                label="Leadership Type"
                //separateLabel
                labelProps={fieldLabelProps}
                value={leadership_type}
                name="leadershiptype"      
              />
            </Stack>

            <Stack direction="row" spacing={2}>
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
              <Stack spacing={2}>
                <FormIndexedSelectField
                  control={control}
                  id="primary_liaison_id"
                  options={INDEXED_LIAISON_SCHOOL_OPTS.filter(option => option.key !== Number(secondaryLiaisonId) && option.key !== Number(tertiaryLiaisonId))}
                  label="Primary Liaison"
                  separateLabel
                  labelProps={fieldLabelProps}
                  onValueChange={handlePrimaryLiaisonChange}
                  value={primaryLiaisonId} 
                />
                <FormIndexedSelectField
                  control={control}
                  id="secondary_liaison_id"
                  options={FILTERED_SECONDARY_OPTIONS}
                  label="Secondary Liaison"
                  separateLabel
                  labelProps={fieldLabelProps}
                  onValueChange={handleSecondaryLiaisonChange}
                />
                <FormIndexedSelectField
                  control={control}
                  id="tertiary_liaison_id"
                  options={FILTERED_TERTIARY_OPTIONS}
                  label="Tertiary Liaison"
                  separateLabel
                  labelProps={fieldLabelProps}
                  onValueChange={handleTertiaryLiaisonChange}
                />
              </Stack>
            )}
            
            <FormField
              variant="standard"
              control={control}
              id="schedule"
              label="Schedule"
              minRows={1}
            />
            <FormField
              variant="standard"
              control={control}
              id="status"
              label="Status"
              multiline
              minRows={1}
            />
          </Stack>
        </Box>
        <Button variant="contained" sx={{ mt: 2 }} onClick={submit} size={isMobile ? "small" : "medium"}>
          Create
        </Button>
      </Box>
    </Modal>
  );
};

export default FormModal;
