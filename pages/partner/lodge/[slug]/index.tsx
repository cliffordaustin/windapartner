import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Stay, UserTypes } from "@/utils/types";
import { AxiosError } from "axios";
import getToken from "@/utils/getToken";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getStayEmail } from "@/pages/api/stays";
import { getUser } from "@/pages/api/user";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import {
  Button,
  ChevronIcon,
  Container,
  Divider,
  Flex,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AddRoomFirstPage from "@/components/Lodge/AddRoomFirstPage";
import { ContextProvider } from "@/context/LodgeDetailPage";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import AddRoomSecondPage from "@/components/Lodge/AddRoomSecondPage";
import { EmblaCarouselType } from "embla-carousel-react";

function LodgeDetail() {
  const token = Cookies.get("token");
  const router = useRouter();
  const { data: user } = useQuery<UserTypes | null>("user", () =>
    getUser(token)
  );

  const { data: stay, isLoading: isStayLoading } = useQuery<Stay>(
    "stay-email",
    () => getStayEmail(router.query.slug as string, token)
  );

  const [opened, { open, close }] = useDisclosure(false);

  const [embla, setEmbla] = React.useState<EmblaCarouselType | null>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  return (
    <div className="p-4">
      <Text weight={700} size="md">
        {stay?.property_name}
      </Text>

      <Divider my={10} />

      <Button onClick={open} color="red">
        Add a room
      </Button>
      <ContextProvider>
        <Modal
          opened={opened}
          onClose={close}
          title={"Add a room"}
          classNames={{
            title: "text-xl font-bold",
            close: "text-black hover:text-gray-700 hover:bg-gray-200",
            header: "bg-gray-100",
          }}
          fullScreen
          transitionProps={{ transition: "fade", duration: 200 }}
          closeButtonProps={{
            style: {
              width: 30,
              height: 30,
            },
            iconSize: 20,
          }}
        >
          <Carousel
            getEmblaApi={(embla) => {
              setEmbla(embla);
            }}
            withControls={false}
            onSlideChange={(index) => {
              setCurrentSlideIndex(index);
            }}
            speed={14}
            mx="auto"
            mb={30}
          >
            <Carousel.Slide>
              <AddRoomFirstPage></AddRoomFirstPage>
            </Carousel.Slide>
            <Carousel.Slide>
              <AddRoomSecondPage></AddRoomSecondPage>
            </Carousel.Slide>
          </Carousel>

          <Container
            pos="fixed"
            bottom={0}
            right={0}
            w="100%"
            className="w-full bg-gray-100 flex justify-between items-center text-right px-10"
          >
            {currentSlideIndex === 0 && <div></div>}
            {currentSlideIndex === 1 && (
              <Flex
                onClick={() => {
                  embla?.scrollPrev();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <IconChevronLeft className="w-5 h-5" />
                <p>Previous</p>
              </Flex>
            )}
            {currentSlideIndex === 0 && (
              <Flex
                onClick={() => {
                  embla?.scrollNext();
                }}
                className="cursor-pointer"
                gap={4}
                align="center"
              >
                <p>Next</p>
                <IconChevronRight className="w-5 h-5" />
              </Flex>
            )}
          </Container>
        </Modal>
      </ContextProvider>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  const token = getToken(context);

  try {
    const user = await queryClient.fetchQuery<UserTypes | null>("user", () =>
      getUser(token)
    );

    if (user?.is_partner) {
      await queryClient.fetchQuery<Stay | null>("stay-email", () =>
        getStayEmail(context.query.slug as string, token)
      );

      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    } else {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/${
            context?.params?.slug || ""
          }`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return {
        redirect: {
          destination: `/partner/signin?redirect=/partner/lodge/${
            context?.params?.slug || ""
          }`,
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  }
};

export default LodgeDetail;
