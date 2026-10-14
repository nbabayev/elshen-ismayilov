"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { usePathname } from "next/navigation";
import PhoneInputField from "@/app/components/molecules/PhoneInputField/PhoneInputFiel";
import ContactSuccessModal from "@/app/components/molecules/ContactSuccessModal/ContactSuccessModal";
import { useCreateContact } from "@/app/hooks/useContacts";

const ContactPage = () => {
  const pathname = usePathname();
  const [error, setError] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const createContact = useCreateContact();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const phone = watch("phone");

  const onSubmit = async (data) => {
    setError(null);

    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Düzgün telefon nömrəsi daxil edin");
      return;
    }

    try {
      const res = await createContact.mutateAsync({
        name: data.name,
        lastName: data.lastname,
        email: data.email,
        phone,
        message: data.message,
      });

      if (res?.success) {
        reset();
        setValue("phone", "");
        setSuccessOpen(true);
      } else {
        setError(res?.message || "Mesaj göndərilmədi");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div>
      {<Breadcrumb page={pathname} />}

      <div className="text-[40px] mt-22 font-[lexend] font-medium text-[#003A3C] text-center">
        Bizimlə əlaqə
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-auto mt-7 md:w-145 w-full">
          <div className="mb-8 md:w-95 w-full m-auto">
            <input
              type="text"
              placeholder="Ad"
              className="w-full rounded-[4px] border border-[#878787] h-12 bg-transparent outline-none pl-4 text-sm text-[#878787] font-[roboto]"
              {...register("name", { required: "Ad tələb olunur" })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-8 md:w-95 w-full m-auto">
            <input
              type="text"
              placeholder="Soyad"
              className="w-full rounded-[4px] border border-[#878787] h-12 bg-transparent outline-none pl-4 text-sm text-[#878787] font-[roboto]"
              {...register("lastname", { required: "Soyad tələb olunur" })}
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastname.message}
              </p>
            )}
          </div>
          <div className="mb-8 md:w-95 w-full m-auto">
            <input
              type="email"
              placeholder="E-poçt"
              className="w-full rounded-[4px] border border-[#878787] h-12 bg-transparent outline-none pl-4 text-sm text-[#878787] font-[roboto]"
              {...register("email", { required: "Email tələb olunur" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
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
            placeholder="Məktubunuz"
            className="w-full rounded-[4px] border border-[#878787] h-50 bg-transparent outline-none p-2 text-sm text-[#878787] font-[roboto]"
            {...register("message", { required: "Mesaj tələb olunur" })}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.message.message}
            </p>
          )}

          {error && (
            <p className="text-center mt-4 text-sm text-red-500">{error}</p>
          )}

          <div className="text-center">
            <button
              className="w-25 mt-12 rounded-sm font-[roboto] text-sm bg-[#C88445] p-3 text-white cursor-pointer disabled:opacity-60"
              type="submit"
              disabled={createContact.isPending}
            >
              {createContact.isPending ? "Göndərilir..." : "Göndər"}
            </button>
          </div>
        </div>
      </form>

      <ContactSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
};

export default ContactPage;
