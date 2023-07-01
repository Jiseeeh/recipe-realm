import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTheme, Box, Button } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";

import Head from "@/components/Head";
import Sidebar from "@/components/sidebar/Sidebar";
import Loader from "@/components/loader/Loader";
import Recipe from "@/interfaces/recipe";

export default function Moderation() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const theme = useTheme();
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "private_id",
      headerName: "Private ID",
      width: 130,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Recipe Name",
      width: 150,
    },
    {
      field: "author_name",
      headerName: "Author",
      width: 100,
    },
    {
      field: "is_pending",
      headerName: "Is Pending",
      width: 90,
    },
    {
      field: "image_link",
      headerName: "Image Link",
      width: 250,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      sortable: false,
    },
    {
      field: "ingredients",
      headerName: "Ingredients",
      width: 300,
      sortable: false,
    },
    {
      field: "delete",
      headerName: "Actions",
      width: 320,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            disabled={isSubmitting}
            onClick={handleRecipeDelete(params.row.id)}
          >
            Delete
          </Button>
          <Button
            disabled={isSubmitting}
            variant="outlined"
            onClick={handleRecipeDisapprove(params.row.id)}
          >
            Disapprove
          </Button>
          <Button
            disabled={isSubmitting}
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={handleRecipeApprove(params.row.id)}
          >
            Approve
          </Button>
        </Box>
      ),
    },
  ];

  const handleSelectionModelChange = (newSelection: GridRowSelectionModel) => {
    setSelectionModel(newSelection);
  };

  const handlePaginationModelChange = (newPagination: GridPaginationModel) => {
    setPaginationModel(newPagination);
  };

  const handleRecipeDelete = (id: number) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const toastId = startLoader("Deleting...");

      try {
        const res = await axios.delete(`${process.env.API}/admin/recipe/${id}`);

        toast.success(res.data.message);

        const updatedRecipes = recipes.filter(
          (recipe) => Number(recipe.id) !== id
        );

        setRecipes(updatedRecipes);
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        endLoader(toastId);
      }
    };
  };

  const handleRecipeApprove = (id: number) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const toastId = startLoader("Approving...");

      try {
        const res = await axios.patch(`${process.env.API}/admin/approve/${id}`);

        toast.success(res.data.message);

        const updatedRecipes = recipes.map((recipe) => {
          if (Number(recipe.id) === id) recipe.is_pending = "false";

          return recipe;
        });

        setRecipes(updatedRecipes);
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        endLoader(toastId);
      }
    };
  };

  const handleRecipeDisapprove = (id: number) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const toastId = startLoader("Disapproving...");

      try {
        const res = await axios.patch(
          `${process.env.API}/admin/disapprove/${id}`
        );

        toast.success(res.data.message);

        const updatedRecipes = recipes.map((recipe) => {
          if (Number(recipe.id) === id) recipe.is_pending = "true";

          return recipe;
        });

        setRecipes(updatedRecipes);
      } catch (error) {
        if (error instanceof AxiosError)
          toast.error(error.response?.data.message);
      } finally {
        endLoader(toastId);
      }
    };
  };

  const handleSelectedDelete = async () => {
    const toastId = startLoader("Deleting...");

    try {
      const res = await axios.delete(
        `${process.env.API}/admin/bulkDelete?ids=${JSON.stringify(
          selectionModel
        )}`
      );

      toast.success(res.data.message);

      const updatedRecipes = recipes.filter(
        (recipe) => !selectionModel.includes(Number(recipe.id))
      );

      setRecipes(updatedRecipes);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      endLoader(toastId);
    }
  };

  const handleSelectedApprove = async () => {
    const toastId = startLoader("Approving...");
    try {
      const res = await axios.patch(
        `${process.env.API}/admin/bulkApprove?ids=${JSON.stringify(
          selectionModel
        )}`
      );

      toast.success(res.data.message);

      const updatedRecipes = recipes.map((recipe) => {
        if (selectionModel.includes(Number(recipe.id)))
          recipe.is_pending = "false";

        return recipe;
      });

      setRecipes(updatedRecipes);
      setSelectionModel([]);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      endLoader(toastId);
    }
  };

  const handleSelectedDisapprove = async () => {
    const toastId = startLoader("Disapproving...");

    try {
      const res = await axios.patch(
        `${process.env.API}/admin/bulkDisapprove?ids=${JSON.stringify(
          selectionModel
        )}`
      );

      toast.success(res.data.message);

      const updatedRecipes = recipes.map((recipe) => {
        if (selectionModel.includes(Number(recipe.id)))
          recipe.is_pending = "true";

        return recipe;
      });

      setRecipes(updatedRecipes);
      setSelectionModel([]);
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error(error.response?.data.message);
    } finally {
      endLoader(toastId);
    }
  };

  /**
   * This function starts a loader and returns a toast ID.
   * @param {string} toastMessage - A string that represents the message to be displayed in the toast
   * notification.
   * @returns a string value which is the ID of the toast message that is being displayed.
   */
  function startLoader(toastMessage: string): string {
    const toastId = toast.loading(toastMessage);
    setIsSubmitting(true);

    return toastId;
  }

  /**
   * The function dismisses a toast and sets a state variable to false.
   * @param {string} toastId - string - This parameter is a unique identifier for the toast message that
   * needs to be dismissed. It is used to locate and dismiss the specific toast message that was
   * displayed during a certain operation.
   */
  function endLoader(toastId: string) {
    toast.dismiss(toastId);
    setIsSubmitting(false);
  }

  // get initial data
  useEffect(() => {
    (async function () {
      try {
        let user: { id: number; username: string; isAdmin: boolean };

        if (localStorage.getItem("user") === null) {
          router.push("/");
          return;
        }

        user = JSON.parse(String(localStorage.getItem("user")));

        const res = await axios.get(
          `${process.env.API}/admin/recipe?id=${user.id}&username=${user.username}`
        );

        const data = res.data;

        data.forEach((recipe: Recipe) => {
          recipe.is_pending = String(!!recipe.is_pending);
        });

        setRecipes(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);

          if (error.response?.data.clearCache) {
            localStorage.clear();
            router.push("/");
          }
        }
      }
    })();
  }, []);

  if (!isLoading) {
    return (
      <>
        <Head />
        <Sidebar>
          {selectionModel.length >= 1 ? (
            <Box sx={{ display: "flex", marginLeft: "auto", marginBottom: 1 }}>
              <Button disabled={isSubmitting} onClick={handleSelectedDelete}>
                Delete selected
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleSelectedDisapprove}
              >
                Disapprove selected
              </Button>
              <Button
                disabled={isSubmitting}
                variant="contained"
                sx={{ color: "#fff" }}
                onClick={handleSelectedApprove}
              >
                Approve selected
              </Button>
            </Box>
          ) : (
            ""
          )}
          <Box
            sx={{
              maxWidth: "100%",
              height: "calc(100vh - 100px)",
            }}
          >
            <DataGrid
              rows={recipes}
              columns={columns}
              checkboxSelection
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleSelectionModelChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
            />
          </Box>
        </Sidebar>
      </>
    );
  }

  return (
    <>
      <Head />
      <Loader />
    </>
  );
}
