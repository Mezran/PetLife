// imports
import { apiSlice } from "../apiSlice";
import { URL_PET } from "../constants";
import { setSelectedPet_id, setSelectedPet_idNull } from "./petSlice";

// other redux hooks

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // petCreate
    petCreate: builder.mutation({
      query: (body) => ({
        url: `${URL_PET}/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PetList"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setSelectedPet_id(result.data.pet._id));
        } catch (error) {
          console.error(error);
        }
      },
    }), // end petCreate
    // petGetAll
    petGetAll: builder.query({
      query: () => ({
        url: `${URL_PET}/`,
        method: "GET",
      }),
      providesTags: ["PetList"],
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          // set selectedPet_id to the first pet in the array
          // if there are pets in the array and selectedPet_id is null
          const result = await queryFulfilled;
          if (getState().pet.selectedPet_id === null && result.data.pets.length > 0) {
            dispatch(setSelectedPet_id(result.data.pets[0]._id));
          }
        } catch (error) {
          console.error(error);
        }
      },
    }), // end petGetAll
    // petGetOne
    petGetOne: builder.query({
      query: (pet_id) => ({
        url: `${URL_PET}/${pet_id}`,
        method: "GET",
      }),
      providesTags: (id) => [{ type: "Pet", id }],
    }), // end petGetOne
    // petUpdate
    petUpdate: builder.mutation({
      query: ({ body, pet_id }) => ({
        url: `${URL_PET}/${pet_id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (id) => [{ type: "Pet", id }, "PetList"],
    }), // end petUpdate
    // petDelete
    petDelete: builder.mutation({
      query: (pet_id) => ({
        url: `${URL_PET}/${pet_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (id) => ["PetList"],
      async onQueryStarted(arg, { dispatch }) {
        try {
          // remove individual pet id from redux state
          dispatch(petApiSlice.util.resetApiState("petGetOne", pet_id));
          dispatch(setSelectedPet_idNull());
        } catch (error) {
          console.error(error);
        }
      },
    }), // end petDelete
  }),
});

// export hooks
export const {
  usePetCreateMutation,
  usePetGetAllQuery,
  usePetGetOneQuery,
  usePetUpdateMutation,
  usePetDeleteMutation,
} = petApiSlice;
