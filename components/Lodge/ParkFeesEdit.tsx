import { getParkFees } from "@/pages/api/stays";
import { LodgeStay } from "@/utils/types";
import {
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  NumberInput,
  ScrollArea,
  Text,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ParkFee from "./ParkFee";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import Cookies from "js-cookie";
import { Auth } from "aws-amplify";

type ParkFeesEditProps = {
  stay: LodgeStay | undefined;
};

function ParkFeesEdit({ stay }: ParkFeesEditProps) {
  const { data: parkFees, isLoading } = useQuery(
    `park-fees-${stay?.slug}`,
    () => getParkFees(stay)
  );

  const queryClient = useQueryClient();

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
      name: "",
      adultPrice: "",
      childPrice: "",
      teenPrice: "",
      nonResidentAdultPrice: "",
      nonResidentChildPrice: "",
      nonResidentTeenPrice: "",
    },
  });

  const [openParkFeesModal, { open: openParkFees, close: closeParkFees }] =
    useDisclosure(false);

  const addParkFees = async (values: ParkFeesValues) => {
    if (stay) {
      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/partner-stays/${stay.slug}/park-fees/`,
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
    }
  };

  const { mutateAsync: addParkFeesMutation, isLoading: addParkFeesLoading } =
    useMutation(addParkFees, {
      onSuccess: () => {
        queryClient.invalidateQueries(`park-fees-${stay?.slug}`);
        closeParkFees();
      },
    });
  return (
    <ScrollArea className="w-full h-[85vh] px-5 pt-5">
      <div className="">
        <Flex justify="space-between" align="center">
          <Text className="font-semibold" size="lg">
            Park Fees
          </Text>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              openParkFees();
            }}
            color="red"
            size="xs"
          >
            Add Park Fees
          </Button>
        </Flex>

        <Modal
          opened={openParkFeesModal}
          onClose={closeParkFees}
          title={"Add Park/Conservancy fees"}
          size="lg"
          classNames={{
            title: "text-lg font-bold",
            close:
              "text-black hover:text-gray-700 w-[40px] h-[30px] hover:bg-gray-100",
            body: "max-h-[500px] overflow-y-scroll px-10 pb-8 w-full",
            content: "rounded-2xl",
          }}
          centered
        >
          <form
            className="flex flex-col gap-1"
            onSubmit={parkFeesForm.onSubmit((values) =>
              addParkFeesMutation(values)
            )}
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
              label="Non-resident adult fee($)"
              placeholder="Enter non-resident adult fee"
              value={parkFeesForm.values.nonResidentAdultPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("nonResidentAdultPrice", value)
              }
            />

            <NumberInput
              label="Non-resident teen fee($)"
              placeholder="Enter non-resident teen fee"
              value={parkFeesForm.values.nonResidentTeenPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("nonResidentTeenPrice", value)
              }
            />

            <NumberInput
              label="Non-resident child fee($)"
              placeholder="Enter non-resident child fee"
              value={parkFeesForm.values.nonResidentChildPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("nonResidentChildPrice", value)
              }
            />

            <NumberInput
              label="Resident adult fee(KES)"
              placeholder="Enter resident adult fee"
              value={parkFeesForm.values.adultPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("adultPrice", value)
              }
            />

            <NumberInput
              label="Resident teen fee(KES)"
              placeholder="Enter resident teen fee"
              value={parkFeesForm.values.teenPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("teenPrice", value)
              }
            />

            <NumberInput
              label="Resident child fee(KES)"
              placeholder="Enter resident child fee"
              value={parkFeesForm.values.childPrice}
              onChange={(value) =>
                parkFeesForm.setFieldValue("childPrice", value)
              }
            />

            <Flex gap={8} justify="right" mt={6}>
              <Button onClick={closeParkFees} variant="default">
                Close
              </Button>
              <Button color="red" loading={addParkFeesLoading} type="submit">
                Submit
              </Button>
            </Flex>
          </form>
        </Modal>

        <Container className="mt-5 p-0 w-full">
          {parkFees && parkFees.length > 0 && (
            <div className="flex flex-col gap-3">
              {parkFees.map((fee, index) => (
                <ParkFee stay={stay} fee={fee} key={index} />
              ))}
            </div>
          )}

          {parkFees && parkFees.length === 0 && (
            <Text className="text-center font-semibold" size="sm">
              No park fees available
            </Text>
          )}
        </Container>
      </div>
    </ScrollArea>
  );
}

export default ParkFeesEdit;
