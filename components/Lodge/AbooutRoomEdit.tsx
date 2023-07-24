import { LodgeStay } from "@/utils/types";
import {
  Button,
  Center,
  FileInput,
  Flex,
  Group,
  Text,
  TextInput,
  FileInputProps,
  rem,
} from "@mantine/core";
import { IconPhoto, IconUpload } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "react-query";
import React from "react";
import Cookies from "js-cookie";
import { useForm } from "@mantine/form";
import axios from "axios";
import StayImages from "./StayImages";

type RoomResidentPriceEditProps = {
  stay: LodgeStay | undefined;
};

function AboutRoomEdit({ stay }: RoomResidentPriceEditProps) {
  const token = Cookies.get("token");
  const queryClient = useQueryClient();

  type FormValues = {
    property_name: string | undefined;
    location: string | undefined;
  };

  const form = useForm<FormValues>({
    initialValues: {
      property_name: stay?.property_name,
      location: stay?.location,
    },
  });

  const ValueComponent: FileInputProps["valueComponent"] = ({ value }) => {
    if (Array.isArray(value)) {
      return (
        <Group spacing="sm" py="xs">
          {value.map((file, index) => (
            <Value file={file} key={index} />
          ))}
        </Group>
      );
    }

    return <Value file={value} />;
  };

  const [files, setFiles] = React.useState<File[]>([]);

  const [noFiles, setNoFiles] = React.useState(false);

  const editProperty = async (values: FormValues) => {
    await axios.patch(
      `${process.env.NEXT_PUBLIC_baseURL}/user-stays-email/${stay?.slug}/`,
      {
        property_name: values.property_name,
        name: values.property_name,
        location: values.location,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      await axios.post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay?.slug}/create-image/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    }

    setFiles([]);
  };

  const { mutateAsync: edit, isLoading: editLoading } = useMutation(
    editProperty,
    {
      onSuccess: () => {
        // refetch stays
        queryClient.invalidateQueries("stay-email");
      },
    }
  );

  function Value({ file }: { file: File | null }) {
    return (
      <Center
        inline
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.colors.gray[1],
          fontSize: theme.fontSizes.xs,
          padding: `${rem(3)} ${rem(7)}`,
          borderRadius: theme.radius.sm,
        })}
      >
        <IconPhoto size={rem(14)} style={{ marginRight: rem(5) }} />
        <span
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxWidth: rem(200),
            display: "inline-block",
          }}
        >
          {file?.name}
        </span>
      </Center>
    );
  }

  return (
    <div className="border border-solid w-full border-gray-200 rounded-xl p-5">
      <Text className="font-semibold" size="lg">
        Resident Prices
      </Text>

      <form
        className="flex flex-col gap-1 mt-4"
        onSubmit={form.onSubmit((values) => edit(values))}
      >
        <TextInput
          label="Property name"
          placeholder="Enter property name"
          value={form.values.property_name}
          onChange={(event) =>
            form.setFieldValue("property_name", event.currentTarget.value)
          }
          required
        />

        <TextInput
          label="Location"
          placeholder="Enter location"
          value={form.values.location}
          onChange={(event) =>
            form.setFieldValue("location", event.currentTarget.value)
          }
          required
        />

        <Flex direction="column" mt={8} gap={3}>
          {stay?.stay_images.map((image, index) => (
            <StayImages stay={stay} image={image} key={index}></StayImages>
          ))}
        </Flex>

        <FileInput
          label="Add image"
          mt={6}
          placeholder="Select one or more images"
          multiple
          valueComponent={ValueComponent}
          value={files}
          onEmptied={() => setNoFiles(true)}
          accept="image/png, image/jpeg, image/jpg"
          icon={<IconUpload size={rem(14)} />}
          error={noFiles ? "Please select at least one file" : ""}
          onChange={(payload: File[]) => {
            setNoFiles(false);
            setFiles(payload);
          }}
        />

        <Flex gap={8} justify="right" mt={6}>
          <Button loading={editLoading} type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </div>
  );
}

export default AboutRoomEdit;
