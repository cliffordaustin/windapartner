import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Price from "../ui/Price";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
};

type BookProps = {
  handleSubmit: (values: FormValues) => void;
  price?: number;
  nights: number;
};

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  message: Yup.string(),
});

const textInputClassNames =
  "appearance-none leading-tight font-semibold border rounded-md focus:outline-none py-3 px-3 w-full text-sm";
const errorClassNames = "mt-1 text-red-500 text-sm font-semibold";
const labelClassNames = "block text-sm font-semibold mb-2";

export default function Book({ handleSubmit, price, nights }: BookProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [invalidPhone, setInvalidPhone] = useState(false);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        values,
        setValues,
        setTouched,
        validateForm,
        isValid,
      }) => (
        <Form>
          <div className="flex flex-col gap-4">
            <div className="flex md:flex-row flex-col items-start gap-4 w-full">
              <div className="w-full">
                <label htmlFor="firstName" className={labelClassNames}>
                  First Name
                </label>
                <Field
                  className={textInputClassNames}
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                />
                <ErrorMessage
                  className={errorClassNames}
                  name="firstName"
                  component="div"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Please give us the name of one of the people staying in this
                  room.
                </p>
              </div>

              <div className="w-full">
                <label htmlFor="lastName" className={labelClassNames}>
                  Last Name
                </label>
                <Field
                  className={textInputClassNames}
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                />
                <ErrorMessage
                  className={errorClassNames}
                  name="lastName"
                  component="div"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClassNames}>
                Email
              </label>
              <Field
                className={textInputClassNames}
                id="email"
                name="email"
                placeholder="Email"
              />
              <ErrorMessage
                className={errorClassNames}
                name="email"
                component="div"
              />
              <p className="text-gray-500 text-sm mt-1">
                We’ll send your confirmation email to this address. Please make
                sure it&apos;s valid.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Cell phone number
              </label>
              <PhoneInput
                placeholder="Enter phone number"
                value={values.phone}
                onChange={(value) => {
                  setValues({
                    ...values,
                    phone: value,
                  });
                }}
                defaultCountry="KE"
              />

              {invalidPhone && (
                <p className="text-sm mt-1 font-semibold text-red-500">
                  Invalid phone number.
                </p>
              )}
            </div>

            <div className="mt-6">
              <div className="h-[0.4px] w-[100%] bg-gray-400"></div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex flex-col gap-2">
                  <div className="font-semibold">Send a message</div>
                  {!values.message && (
                    <div className="text-sm text-gray-600">
                      Let us know of any additional information you have
                    </div>
                  )}

                  {values.message && (
                    <div className="text-sm text-gray-600">
                      {values.message}
                    </div>
                  )}
                </div>

                <div
                  onClick={() => {
                    setShowMessage(!showMessage);
                  }}
                  className="p-2 rounded-full cursor-pointer border-transparent border flex items-center justify-center hover:border-gray-200 hover:shadow-lg transition-all duration-300 ease-linear"
                >
                  {!values.message && (
                    <Icon className="w-5 h-5" icon="fluent:add-16-filled" />
                  )}

                  {values.message && (
                    <Icon className="w-5 h-5" icon="clarity:pencil-solid" />
                  )}
                </div>
              </div>

              <div className="h-[0.4px] w-[100%] bg-gray-400 mt-6"></div>

              <Modal
                open={showMessage}
                closeModal={() => {
                  setShowMessage(false);
                }}
              >
                <div className="p-4 mt-5">
                  <label htmlFor="message" className={labelClassNames}>
                    Message
                  </label>
                  <Field
                    className={textInputClassNames + " h-[220px] resize-none"}
                    as="textarea"
                    id="message"
                    name="message"
                    placeholder="Message"
                  />
                </div>

                <div
                  onClick={() => {
                    setShowMessage(false);
                  }}
                  className="w-[35px] cursor-pointer font-normal text-2xl h-[35px] rounded-full flex items-center justify-center absolute top-4 right-4 border border-black"
                >
                  <Icon icon="iconoir:cancel" />
                </div>

                <Button
                  onClick={() => {
                    setShowMessage(false);
                  }}
                  className="px-8 ml-auto  mb-4 flex items-center justify-center mr-3 gradient-red h-[40px] !font-bold !rounded-lg"
                >
                  <span className="text-white text-sm font-bold">Done</span>
                </Button>
              </Modal>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Price</h1>

              {price && (
                <Price price={price * nights} className="!text-base"></Price>
              )}
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Card processing fees (3.8%)</h1>

              {price && (
                <Price
                  price={price * nights * 0.038}
                  className="!text-base"
                ></Price>
              )}
            </div>

            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Total price</h1>

              {price && (
                <Price
                  price={price * nights + price * nights * 0.038}
                  className="!text-base"
                ></Price>
              )}
            </div>

            <div className="mt-4 mb-3">
              <button
                type="button"
                onClick={() => {
                  setTouched({
                    firstName: true,
                    lastName: true,
                    email: true,
                  });

                  if (isValidPhoneNumber(values.phone || "") && isValid) {
                    setInvalidPhone(false);
                    validateForm().then(() => {
                      handleSubmit(values);
                    });
                  } else {
                    setInvalidPhone(true);
                  }
                }}
                className="flex w-full mb-3 justify-center items-center gap-1 rounded-lg !px-0 !py-3 font-semibold gradient-red !text-white"
              >
                <span>Pay now</span>
                <Icon icon="bxs:lock-alt" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
