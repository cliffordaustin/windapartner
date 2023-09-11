import { ParkFee } from "@/pages/api/stays";
import { LodgeStay } from "@/utils/types";
import {
  Button,
  Flex,
  Loader,
  Modal,
  NumberInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

type ParkFeeProps = {
  fee: ParkFee;
  stay: LodgeStay | undefined;
  token: string | undefined;
};

function ParkFee({ fee, stay, token }: ParkFeeProps) {
  const queryClient = useQueryClient();

  const deleteParkFee = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay?.slug}/park-fees/${fee.id}/`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  };

  const { mutateAsync: deleteFee, isLoading: deleteLoading } = useMutation(
    deleteParkFee,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`park-fees-${stay?.slug}`);
      },
    }
  );

  const [editModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  type ParkFeesValues = {
    name: string | "";
    adultPrice: number | "";
    childPrice: number | "";
    teenPrice: number | "";
    nonResidentAdultPrice: number | "";
    nonResidentChildPrice: number | "";
    nonResidentTeenPrice: number | "";
  };

  const parkFeesForm = useForm<ParkFeesValues>({
    initialValues: {
      name: fee.name || "",
      adultPrice: Number(fee.resident_adult_price) || "",
      childPrice: Number(fee.resident_child_price) || "",
      teenPrice: Number(fee.resident_teen_price) || "",
      nonResidentAdultPrice: Number(fee.non_resident_adult_price) || "",
      nonResidentChildPrice: Number(fee.non_resident_child_price) || "",
      nonResidentTeenPrice: Number(fee.non_resident_teen_price) || "",
    },
  });

  const editParkFees = async (values: ParkFeesValues) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay?.slug}/park-fees/${fee.id}/`,
      {
        name: values.name,
        resident_adult_price: Number(values.adultPrice),
        resident_child_price: Number(values.childPrice),
        resident_teen_price: Number(values.teenPrice),
        non_resident_adult_price: Number(values.nonResidentAdultPrice),
        non_resident_child_price: Number(values.nonResidentChildPrice),
        non_resident_teen_price: Number(values.nonResidentTeenPrice),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const { mutateAsync: editFee, isLoading: editLoading } = useMutation(
    editParkFees,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`park-fees-${stay?.slug}`);
        closeEditModal();
      },
    }
  );
  return (
    <>
      {!!fee && (
        <div className="px-4 py-3 border border-solid border-gray-100 bg-gray-50 rounded-md">
          <Flex align="center" justify="space-between">
            <Text size="md" className="font-semibold">
              {fee.name}
            </Text>

            <div className="flex gap-2 items-center rounded-full bg-white">
              <div
                onClick={() => deleteFee()}
                className="p-1 flex shadow-md cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
              >
                <IconTrash size={18} color="red"></IconTrash>
              </div>

              <div
                onClick={openEditModal}
                className="p-1 shadow-md flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
              >
                <IconPencil size={22} color="blue"></IconPencil>
              </div>
            </div>
          </Flex>
          <div className="flex flex-wrap mt-3 gap-3">
            <Text className="text-sm text-gray-500 font-semibold">
              Adult:{" "}
              <span className="font-bold text-gray-800">
                ${fee.non_resident_adult_price} / KES{fee.resident_adult_price}
              </span>
            </Text>
            <Text className="text-sm text-gray-500 font-semibold">
              Teen:{" "}
              <span className="font-bold text-gray-800">
                ${fee.non_resident_teen_price} / KES{fee.resident_teen_price}
              </span>
            </Text>
            <Text className="text-sm text-gray-500 font-semibold">
              Child:{" "}
              <span className="font-bold text-gray-800">
                ${fee.non_resident_child_price} / KES{fee.resident_child_price}
              </span>
            </Text>
          </div>
        </div>
      )}

      <Modal
        opened={editModal}
        onClose={closeEditModal}
        title={"Edit fee"}
        classNames={{
          title: "text-lg font-bold",
          close: "text-black hover:text-gray-700 hover:bg-gray-200",
          header: "bg-gray-100",
        }}
        transitionProps={{ transition: "fade", duration: 200 }}
        closeButtonProps={{
          style: {
            width: 30,
            height: 30,
          },
          iconSize: 20,
        }}
      >
        <form
          className="flex flex-col gap-1"
          onSubmit={parkFeesForm.onSubmit((values) => editFee(values))}
        >
          <TextInput
            label="Fee name"
            placeholder="Enter fee name"
            value={parkFeesForm.values.name}
            onChange={(event) =>
              parkFeesForm.setFieldValue("name", event.currentTarget.value)
            }
            required
          />

          <NumberInput
            label="Resident adult fee"
            placeholder="Enter resident adult fee"
            value={parkFeesForm.values.adultPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("adultPrice", value)
            }
          />

          <NumberInput
            label="Resident teen fee"
            placeholder="Enter resident teen fee"
            value={parkFeesForm.values.teenPrice}
            onChange={(value) => parkFeesForm.setFieldValue("teenPrice", value)}
          />

          <NumberInput
            label="Resident child fee"
            placeholder="Enter resident child fee"
            value={parkFeesForm.values.childPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("childPrice", value)
            }
          />

          <NumberInput
            label="Non-resident adult fee"
            placeholder="Enter non-resident adult fee"
            value={parkFeesForm.values.nonResidentAdultPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentAdultPrice", value)
            }
          />

          <NumberInput
            label="Non-resident teen fee"
            placeholder="Enter non-resident teen fee"
            value={parkFeesForm.values.nonResidentTeenPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentTeenPrice", value)
            }
          />

          <NumberInput
            label="Non-resident child fee"
            placeholder="Enter non-resident child fee"
            value={parkFeesForm.values.nonResidentChildPrice}
            onChange={(value) =>
              parkFeesForm.setFieldValue("nonResidentChildPrice", value)
            }
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeEditModal} variant="default">
              Close
            </Button>
            <Button disabled={editLoading} type="submit">
              Submit{" "}
              {editLoading && <Loader size="xs" color="gray" ml={5}></Loader>}
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

export default ParkFee;
