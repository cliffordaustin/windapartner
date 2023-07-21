import { getStayActivities } from "@/pages/api/stays";
import { Stay } from "@/utils/types";
import {
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Activity from "./Activity";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "@mantine/form";

type ActivityEditProps = {
  stay: Stay | undefined;
};

function ActivityEdit({ stay }: ActivityEditProps) {
  const { data: activities, isLoading } = useQuery(
    `activities-${stay?.slug}`,
    () => getStayActivities(stay)
  );

  const token = Cookies.get("token");

  const queryClient = useQueryClient();

  type ActivityValues = {
    name: string | "";
    description: string | "";
    residentPrice: number | "";
    nonResidentPrice: number | "";
  };

  const activityForm = useForm<ActivityValues>({
    initialValues: {
      name: "",
      description: "",
      residentPrice: "",
      nonResidentPrice: "",
    },
  });

  const [openActivityModal, { open: openActivity, close: closeActivity }] =
    useDisclosure(false);

  const [activityOption, setActivityOption] = React.useState<string | null>(
    "PER PERSON"
  );

  const addActivityFunc = async (values: ActivityValues) => {
    if (stay) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/activities/`,
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
    }
  };

  const { mutateAsync: addActivity, isLoading: activityLoading } = useMutation(
    addActivityFunc,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`activities-${stay?.slug}`);
        closeActivity();
      },
    }
  );

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Flex justify="space-between" align="center">
        <Text className="font-semibold" size="lg">
          Activities/Extras
        </Text>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            openActivity();
          }}
          color="red"
          size="xs"
        >
          Add Activity
        </Button>
      </Flex>

      <Modal
        opened={openActivityModal}
        onClose={closeActivity}
        title={"Activities/Extras"}
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
          onSubmit={activityForm.onSubmit((values) => addActivity(values))}
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
            label="Non-resident Price"
            placeholder="Enter non-resident price"
            value={activityForm.values.nonResidentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("nonResidentPrice", value)
            }
          />

          <NumberInput
            label="Resident Price"
            placeholder="Enter resident price"
            value={activityForm.values.residentPrice}
            onChange={(value) =>
              activityForm.setFieldValue("residentPrice", value)
            }
          />

          <Flex gap={8} justify="right" mt={6}>
            <Button onClick={closeActivity} variant="default">
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

      <Container className="mt-5 p-0 w-full">
        {activities && activities.length > 0 && (
          <div className="flex flex-col gap-3">
            {activities.map((fee, index) => (
              <Activity stay={stay} fee={fee} key={index} />
            ))}
          </div>
        )}

        {activities && activities.length === 0 && (
          <Text className="text-center font-semibold" size="sm">
            No activities available
          </Text>
        )}
      </Container>
    </div>
  );
}

export default ActivityEdit;
