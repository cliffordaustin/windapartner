import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  panelClassName?: string;
  panelDialogClassName?: string;
  containerDialogClassName?: string;
};

export default function Modal({
  children,
  open,
  closeModal,
  panelClassName = "",
  panelDialogClassName = "",
  containerDialogClassName = "",
}: ModalProps) {
  return (
    <Transition appear as={Fragment} show={open}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          closeModal();
        }}
      >
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={"fixed inset-0 bg-black bg-opacity-25 "}></div>
        </Transition.Child>

        <div className={"fixed inset-0 overflow-y-auto " + panelClassName}>
          <div
            className={
              "flex min-h-full items-center justify-center text-center " +
              containerDialogClassName
            }
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={
                  "w-full max-w-xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all " +
                  panelDialogClassName
                }
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
