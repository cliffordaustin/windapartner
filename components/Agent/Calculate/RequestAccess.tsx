import { Button, FileInput, Flex, rem } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { Auth } from "aws-amplify";
import axios from "axios";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

type RequestAccessProps = {
  staySlug: string | undefined;
};

function RequestAccess({ staySlug }: RequestAccessProps) {
  const [document, setDocument] = useState<File | null>(null);

  const [noDocument, setNoDocument] = useState(false);

  const addAgentToStay = async () => {
    if (!document) {
      setNoDocument(true);
      return;
    } else {
      setNoDocument(false);
      const formData = new FormData();
      formData.append("document", document);

      const currentSession = await Auth.currentSession();
      const accessToken = currentSession.getAccessToken();
      const token = accessToken.getJwtToken();

      await axios.patch(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${staySlug}/update-agents-with-file/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(addAgentToStay, {
    onSuccess: () => {
      queryClient.invalidateQueries("partner-stays-without-access");
      close();
    },
  });
  return (
    <div>
      <FileInput
        label="Upload documents"
        placeholder="Accepted file types: PDF"
        accept="application/pdf"
        icon={<IconUpload size={rem(14)} />}
        error={noDocument ? "Please select at least one file" : ""}
        onChange={(payload: File) => {
          setNoDocument(false);
          setDocument(payload);
        }}
      />

      <Flex gap={8} justify="space-between" className="mt-4">
        <Button color="gray" onClick={close} variant="light">
          Close
        </Button>
        <Button
          onClick={() => {
            mutateAsync();
          }}
          color="red"
          loading={isLoading}
        >
          Request Access
        </Button>
      </Flex>
    </div>
  );
}

export default RequestAccess;
