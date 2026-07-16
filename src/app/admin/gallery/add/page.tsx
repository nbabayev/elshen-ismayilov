"use client";

import React, { useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CSpinner,
  CImage,
} from "@coreui/react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { useCreateGallery } from "@/app/hooks/useGallery";
// validation & form
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, GalleryFormData } from "@/schema";

export default function AddGalleryPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateGallery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema), // Sxemi bura bağlayırıq
    defaultValues: {
      title: "",
      type: "image",
      thumbImg: "",
      images: [],
      viewDate: new Date().toISOString().split("T")[0],
      videos: [],
    },
  });
  const thumbImgValue = watch("thumbImg");
  const type = watch("type");
  const all = watch();
  console.log(all);
  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control,
    name: "videos",
  });

  const removeImage = (index: number) => {
    const currentImages = watch("images") || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);

    setValue("images", updatedImages);
  };

  const onSubmit = async (data: GalleryFormData) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("viewDate", data.viewDate);
    formData.append("thumbImg", data.thumbImg);
    formData.append("videos", JSON.stringify(data.videos));
    // data.images.forEach((file) => formData.append("images", file));

    createMutation.mutate(formData, {
      onSuccess: () => {
        enqueueSnackbar("Qalereya uğurla əlavə edildi!", {
          variant: "success",
        });
        router.push("/admin/gallery");
      },
      onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
    });
  };

  useEffect(() => {
    if (thumbImgValue instanceof File) {
      const objectUrl = URL.createObjectURL(thumbImgValue);
      // Komponent unmount olunanda və ya şəkil dəyişəndə köhnə linki RAM-dan silir
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [thumbImgValue]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Yeni Qalereya</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <CFormLabel>Başlıq</CFormLabel>
                <CFormInput
                  type="text"
                  {...register("title")}
                  placeholder="Başlıq daxil edin"
                />
                {errors.title && (
                  <p className="text-danger">{errors.title.message}</p>
                )}
              </div>
              <div className="mb-3">
                <CFormLabel>Növ</CFormLabel>
                <CFormSelect {...register("type")}>
                  <option value="image">Şəkil</option>
                  <option value="video">Video</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Örtük şəkli (URL)</CFormLabel>
                <Controller
                  control={control}
                  name="thumbImg"
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <CFormInput
                      ref={ref}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          onChange(files[0] ?? undefined);
                        }
                      }}
                      onBlur={onBlur}
                      name={name}
                    />
                  )}
                />
                {errors.thumbImg &&
                  typeof errors.thumbImg.message === "string" && (
                    <p className="text-danger">{errors.thumbImg.message}</p>
                  )}
                {thumbImgValue && (
                  <div className="mt-2">
                    <CImage
                      src={
                        thumbImgValue instanceof File
                          ? URL.createObjectURL(thumbImgValue)
                          : thumbImgValue
                      }
                      width={200}
                      alt="thumb"
                    />
                  </div>
                )}
              </div>
              {type === "image" && (
                <>
                  <CFormLabel htmlFor="images">
                    Qalereyaya şəkillər yüklə
                  </CFormLabel>
                  <div className="mb-3 d-flex gap-3 flex-wrap">
                    {((watch("images") || []) as File[]).map((field, index) => (
                      <CCard style={{ width: "18rem" }} key={index}>
                        <CImage
                          src={
                            field instanceof File
                              ? URL.createObjectURL(field)
                              : field
                          }
                          alt={`preview-${index}`}
                          className="w-100"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <CCardBody className="text-end">
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => removeImage(index)}
                          >
                            Sil
                          </CButton>
                        </CCardBody>
                      </CCard>
                    ))}
                  </div>
                  <Controller
                    control={control}
                    name="images"
                    render={({
                      field: { onChange, ref, value, ...fieldFields },
                    }) => (
                      <CFormInput
                        {...fieldFields}
                        ref={ref}
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="mb-3"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            onChange(Array.from(files));
                          }
                        }}
                      />
                    )}
                  />
                  {errors.images && (
                    <p className="text-danger">{errors.images.message}</p>
                  )}
                </>
              )}
              <div className="mb-3">
                <CFormLabel>Tarix</CFormLabel>
                <CFormInput type="date" {...register("viewDate")} />
              </div>
              {type === "video" && (
                <>
                  <CFormLabel>Videolar</CFormLabel>
                  {videoFields.map((field, index) => (
                    <div key={field.id} className="mb-3 p-3 border rounded">
                      <CFormLabel>Video Link {index + 1}</CFormLabel>
                      <CFormInput
                        type="text"
                        {...register(`videos.${index}.url`)}
                        className="mb-2"
                        placeholder="https://..."
                      />
                      {errors.videos?.[index] && (
                        <p className="text-danger">
                          {errors.videos[index].message}
                        </p>
                      )}
                      <CFormLabel>Video başlığı</CFormLabel>
                      <CFormInput
                        type="text"
                        {...register(`videos.${index}.title`)}
                        className="mb-2"
                        placeholder="Video başlığı"
                      />
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => removeVideo(index)}
                      >
                        Sil
                      </CButton>
                    </div>
                  ))}
                  <br />
                  <CButton
                    type="button" // Important to prevent form submission
                    color="primary"
                    className="mb-3"
                    onClick={() => appendVideo({ title: "", url: "" })}
                  >
                    Video əlavə et
                  </CButton>
                  {errors.videos && (
                    <p className="text-danger">{errors.videos.message}</p>
                  )}
                </>
              )}
              <div className="flex justify-end">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={createMutation.isPending && isSubmitting}
                >
                  {createMutation.isPending ? (
                    <CSpinner size="sm" />
                  ) : (
                    "Əlavə et"
                  )}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}
