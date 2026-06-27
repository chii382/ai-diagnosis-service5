export const adminGlassCardSx = {
  backgroundColor: "rgba(0,0,0,0.42)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
} as const;

export const adminDataGridSx = {
  border: "none",
  color: "#fff",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  "& .MuiDataGrid-cell": {
    borderColor: "rgba(255,255,255,0.08)",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(56,123,255,0.08)",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
  "& .MuiTablePagination-root, & .MuiDataGrid-selectedRowCount": {
    color: "rgba(255,255,255,0.75)",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255,255,255,0.7)",
  },
} as const;
