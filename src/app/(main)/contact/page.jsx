"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { usePathname } from "next/navigation";
import FormInput from "@/app/components/atoms/FormInput/FormInput";
import PhoneInputField from "@/app/components/molecules/PhoneInputField/PhoneInputFiel";

const ContactPage = ({ params }) => {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const phone = watch("phone");

  return (
    <div>
      {<Breadcrumb page={pathname} />}

      <div className="text-[40px] mt-22 font-[lexend] font-medium text-[#003A3C] text-center">
        Bizimlə əlaqə
      </div>
      <form action="">
        <div className="m-auto mt-7 md:w-145 w-full">
          <div className="mb-8 md:w-95 w-full m-auto">
            <FormInput type="text" placeholder="Ad" name="name" />
          </div>
          <div className="mb-8 md:w-95 w-full m-auto">
            <FormInput type="text" placeholder="Soyad" name="lastname" />
          </div>
          <div className="mb-8 md:w-95 w-full m-auto">
            <FormInput type="email" placeholder="E-poçt" name="email" />
          </div>
          <div className="mb-8 md:w-95 w-full m-auto">
            <PhoneInputField
              value={phone}
              onChange={(val) => setValue("phone", val)}
              error={
                phone && !isValidPhoneNumber(phone) && "Yanlış telefon nömrəsi"
              }
            />
          </div>
          <textarea
            name=""
            id=""
            placeholder="Məktubunuz"
            className="
                w-full rounded-[4px] border border-[#878787]
      h-50
      rounded-l-sm w-full bg-transparent border-r border-#E1E1E1 outline-none p-2 text-sm text-[#878787] font-[roboto]"
          ></textarea>

          <div className="text-center">
            <button
              className="w-25 mt-12 rounded-sm font-[roboto] text-sm bg-[#C88445] p-3 text-white cursor-pointer"
              type="button"
            >
              Göndər
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
