import { ActivityFee, Stay } from "@/utils/types";
import {
  Button,
  Flex,
  Loader,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useMutation, useQueryClient } from "react-query";

type ParkFeeProps = {
  fee: ActivityFee;
  stay: Stay | undefined;
};

function Activity({ fee, stay }: ParkFeeProps) {
  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  const deleteParkFee = async () => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay?.slug}/activities/${fee.id}/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );
  };

  const { mutateAsync: deleteFee, isLoading: deleteLoading } = useMutation(
    deleteParkFee,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`activities-${stay?.slug}`);
      },
    }
  );

  const [editModal, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [activityOption, setActivityOption] = React.useState<string | null>(
    "PER PERSON"
  );

  type ActivityValues = {
    name: string | "";
    description: string | "";
    residentPrice: number | "";
    nonResidentPrice: number | "";
  };

  const activityForm = useForm<ActivityValues>({
    initialValues: {
      name: fee.name || "",
      description: fee.description || "",
      residentPrice: Number(fee.resident_price) || "",
      nonResidentPrice: Number(fee.price) || "",
    },
  });

  const editActivity = async (values: ActivityValues) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay?.slug}/activities/${fee.id}/`,
      {
        name: values.name,
        description: values.description,
        resident_price: Number(values.residentPrice),
        price: Number(values.nonResidentPrice),
        price_type: activityOption,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
  };

  const { mutateAsync: edit, isLoading: activityLoading } = useMutation(
    editActivity,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`activities-${stay?.slug}`);
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

          <Text size="sm" mt={4} className="">
            {fee.description}
          </Text>
          <div className="flex items-center flex-wrap mt-3 gap-2">
            <Text className="text-sm text-gray-500 font-semibold">
              <span className="font-bold text-gray-800">
                ${fee.price} / KES{fee.resident_price}
              </span>
            </Text>

            <Text className="text-sm text-gray-700 font-semibold">
              ({fee.price_type.toLowerCase()})
            </Text>
          </div>
        </div>
      )}

      <Modal
        opened={editModal}
        onClose={closeEditModal}
        title={"Edit activity"}
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
          onSubmit={activityForm.onSubmit((values) => edit(values))}
        >
          <TextInput
            label="Activity name"
            placeholder="Enter activity name"
            value={activityForm.values.name}
            onChange={(event) =>
              activityForm.setFieldValue("name", event.currentTarget.value)
            }
            required
          />

          <TextInput
            label="Activity description"
            placeholder="Enter activity description"
            value={activityForm.values.description}
            onChange={(event) =>
              activityForm.setFieldValue(
                "description",
                event.currentTarget.value
              )
            }
          />

          <Select
            label="Select the pricing type"
            placeholder="Select the pricing type"
            value={activityOption}
            onChange={(value) => setActivityOption(value)}
            data={[
              { label: "Per Person", value: "PER PERSON" },
              { label: "Per Person Per Night", value: "PER PERSON PER NIGHT" },
              { label: "Whole Group", value: "WHOLE GROUP" },
            ]}
            required
          />

          <NumberInput
            label="Resident Activity Price"
            placeholder="Enter resident activity price"
            value={activityForm.values.residentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("residentPrice", value)
            }
          />

          <NumberInput
            label="Non-resident Activity Price"
            placeholder="Enter non-resident activity price"
            value={activityForm.values.nonResidentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("nonResidentPrice", value)
            }
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeEditModal} variant="default">
              Close
            </Button>
            <Button disabled={activityLoading} type="submit">
              Submit{" "}
              {activityLoading && (
                <Loader size="xs" color="gray" ml={5}></Loader>
              )}
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
}

export default Activity;
