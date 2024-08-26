import { useState } from "react";
import NavCrumbsLink from "@components/common/nav-crumbs/nav-crumbs-link";
import PageHeader from "@components/common/page-header";
import SafeDataGrid from "@components/common/safe-data-grid";
import { AccountBox } from "@mui/icons-material";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { GridColDef, GridAlignment } from "@mui/x-data-grid";
import FormModal from "./form-modal";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { OpenInNew } from "@mui/icons-material";

export default function LeaderShipDataGrid({
  title,
  breadcrumbLinks,
  data,
  isFetching,
  leadershiptype
}) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "Actions",
      type: "actions",
      width: 20,
      getActions: ({ row: { id } }) => [
        <GridActionsCellItem
          icon={<OpenInNew />}
          label="Open"
          showInMenu
          onClick={() => navigate(`./${id}`)}
        />,
      ],
    },
    {
      field: "course_code",
      headerName: "Course Code",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "string",
      width: 175,
    },
    {
      field: "leadershiptype",
      headerName: "Type" as GridAlignment,
      align: "center" as GridAlignment,
      headerAlign: "center",
      type: "string",
      width: 50,
    },
    {
      field: "facilitatorTunnels",
      headerName: "Facilitators",
      align: "center",
      headerAlign: "center",
      width: 225,
      renderCell: (params) =>
        params.row.facilitatorTunnels.length != 0 ? (
          <div
            style={{
              background: "#BEBEBE",
              width: "100%",
              padding: "8px",
              borderRadius: "15px",
              marginBlock: "12px",
              border: "1px solid black",
            }}
          >
            <Stack spacing={1}>
              {params.row.facilitatorTunnels.map((ele, id) => (
                <Chip
                  key={id}
                  style={{ background: "white", border: "1px solid black" }}
                  label={
                    ele.facilitator.user.first_name +
                    " " +
                    ele.facilitator.user.last_name
                  }
                  variant="outlined"
                />
              ))}
            </Stack>
          </div>
        ) : (
          <Typography variant="subtitle2" component="h1">
            No Facilitator Assigned
          </Typography>
        ),
    },
    {
      field: "start_date",
      headerName: "Start Date",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "Date",
      width: 110,
      valueGetter: ({ row }) => row.start_date.slice(0, 10),
    },
    {
      field: "end_date",
      headerName: "End Date",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "Date",
      width: 110,
      valueGetter: ({ row }) => row.end_date.slice(0, 10),
    },
    {
      field: "schedule",
      headerName: "Schedule",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "string",
      width: 150,
    },

    {
      field: "primary_liaison",
      headerName: "Primary Liaison",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "string",
      width: 135,
    },{
      field: "secondary_liaison",
      headerName: "Secondary Liaison",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "string",
      width: 135,
    },{
      field: "tertiary_liaison",
      headerName: "Tertiary Liaison",
      align: "center" as GridAlignment,
      headerAlign: "center" as GridAlignment,
      type: "string",
      width: 135,
    },
  ];

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent={isMobile ? "space-around" : "space-between"}
        alignItems="center"
      >
        <PageHeader title={title}>
          {breadcrumbLinks.map((link, index) =>
            link.main ? (
              <NavCrumbsLink main key={index} to={link.to}>
                {link.label}
              </NavCrumbsLink>
            ) : (
              <NavCrumbsLink key={index} to={link.to}>
                {link.label}
              </NavCrumbsLink>
            )
          )}
        </PageHeader>

        <Button
          variant="contained"
          sx={{ mt: 2, width: `${isMobile ? "100%" : "inherit"}` }}
          onClick={handleOpenModal}
        >
          <AddIcon sx={{ paddingInline: "5px" }} /> Create Course
        </Button>
      </Stack>

      <SafeDataGrid
        columns={columns}
        rows={data}
        loading={isFetching}
        getRowHeight={() => "auto"}
        sx={{
          border: "none",
          padding: "5px",
        }}
        density="compact"
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
          sorting: {
            sortModel: [
              {
                field: "submitted_at",
                sort: "desc",
              },
            ],
          },
        }}
      />
      <FormModal open={openModal} onClose={handleCloseModal} leadership_type={leadershiptype} />
    </Stack>
  );
}
