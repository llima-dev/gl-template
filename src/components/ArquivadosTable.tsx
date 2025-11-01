import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Tooltip } from "@mui/material";
import type { Template } from "../types";

type Props = {
  templates: Template[];
  onRemover: (idx: number) => void;
  onDesarquivar: (idx: number) => void;
};

export default function ArquivadosTable({
  templates,
  onRemover,
  onDesarquivar,
}: Props) {
  const rows = templates.map((t, i) => ({
    id: i,
    nomeTarefa: t.nomeTarefa || "(sem nome)",
    escopo: t.escopo || "Sem escopo",
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const box = document.querySelector(
        'input[name="select_all_rows"]'
      ) as HTMLInputElement | null;

      if (box) {
        box.addEventListener("click", (e) => e.stopPropagation());
        box.addEventListener("mousedown", (e) => e.preventDefault());
        box.readOnly = true;
        box.style.cursor = "not-allowed";
        box.title = "Seleção total desabilitada";
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const columns: GridColDef[] = [
    { field: "nomeTarefa", headerName: "Nome da Tarefa", flex: 1.2 },
    { field: "escopo", headerName: "Escopo", flex: 1.8 },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <div className="d-flex gap-1">
          <Tooltip title="Desarquivar template">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onDesarquivar(params.row.id)}
            >
              <FontAwesomeIcon icon={faBoxOpen} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Remover permanentemente">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                onRemover(params.row.id);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowSelectionModelChange={(selection: GridRowSelectionModel | any) => {
          const raw = (selection as any)?.ids ?? selection;
          const arr = Array.from(raw as unknown as Iterable<string | number>);
          setSelecionados(arr.map((id) => Number(id)));
        }}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 400 },
          },
        }}
      />
    </div>
  );
}
