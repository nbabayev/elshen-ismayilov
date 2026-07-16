"use client";

import React, { useState, useEffect } from "react";
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
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, GalleryFormData } from "@/schema";
import { useGalleryById, useUpdateGallery } from "@/app/hooks/useGallery";

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading } = useGalleryById(id);
  const gallery = data?.data;
  const { enqueueSnackbar } = useSnackbar();
  const updateMutation = useUpdateGallery();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: "",
      type: "image",
      thumbImg: "",
      viewDate: "",
      images: [],
      videos: [],
    },
  });

  const type = watch("type");
  const thumbImgValue = watch("thumbImg");
  const images = watch("images");
  const removeImage = (index: number) => {
    const currentImages = watch("images") || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);

    setValue("images", updatedImages);
  };
  console.log(images);
  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control,
    name: "videos",
  });

  useEffect(() => {
    if (gallery) {
      reset({
        title: gallery.title || "",
        type: gallery.type || "image",
        thumbImg: gallery.thumbImg || "",
        images: gallery.images || [],
        videos: gallery.videos || [],
        viewDate: gallery.viewDate
          ? new Date(gallery.viewDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [gallery, reset]);

  const onSubmit = async (data: GalleryFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("viewDate", data.viewDate);
    formData.append("thumbImg", data.thumbImg);
    formData.append("videos", JSON.stringify(data.videos));
    const restImages_id = data.images
      .filter(
        (img): img is { id: number; imageUrl: string } =>
          typeof img === "object" && !(img instanceof File)
      )
      .map((img) => img.id);
    formData.append("restImages_id", JSON.stringify(restImages_id));
    data.images.forEach((img) => {
      if (img instanceof File) {
        formData.append("images", img);
      }
    });
    console.log(formData);
    updateMutation.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          enqueueSnackbar("Qalereya uğurla yeniləndi!", {
            variant: "success",
          });
          router.push("/admin/gallery");
        },
        onError: () => enqueueSnackbar("Xəta baş verdi!", { variant: "error" }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Qalereyani redaktə et</strong>
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
                <CFormSelect
                  {...register("type")}
                  disabled // Tip dəyişdirilə bilməz
                >
                  <option value="image">Şəkil</option>
                  <option value="video">Video</option>
                </CFormSelect>
              </div>
              <div className="mb-3">
                <CFormLabel>Örtük şəkli</CFormLabel>
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
              <div className="mb-3">
                <CFormLabel>Tarix</CFormLabel>
                <CFormInput type="date" {...register("viewDate")} />
              </div>
              {type === "image" && (
                <>
                  <CFormLabel htmlFor="images">
                    Qalereyaya şəkillər yüklə *
                  </CFormLabel>
                  <div className="mb-3 d-flex gap-3 flex-wrap">
                    {(
                      (watch("images") || []) as (
                        | string
                        | File
                        | { id: number; imageUrl: string }
                      )[]
                    ).map((img, index) => {
                      let srcUrl = "";
                      if (img instanceof File) {
                        srcUrl = URL.createObjectURL(img);
                      } else if (typeof img === "string") {
                        srcUrl = img;
                      } else if (
                        img &&
                        typeof img === "object" &&
                        "imageUrl" in img
                      ) {
                        srcUrl = img.imageUrl;
                      }
                      return (
                        <CCard style={{ width: "18rem" }} key={index}>
                          <CCardBody>
                            <CImage
                              src={srcUrl}
                              alt={`Preview ${index}`}
                              className="w-100"
                              style={{ maxHeight: "200px", objectFit: "cover" }}
                            />
                            <div className="mt-2 text-end">
                              <CButton
                                color="danger"
                                size="sm"
                                onClick={() => removeImage(index)}
                              >
                                Sil
                              </CButton>
                            </div>
                          </CCardBody>
                        </CCard>
                      );
                    })}
                  </div>
                  <Controller
                    control={control}
                    name="images"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                      <CFormInput
                        ref={ref}
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="mb-3"
                        onBlur={onBlur}
                        name={name}
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            const newFiles = Array.from(files);
                            const existingFiles = watch("images") || [];

                            onChange([...existingFiles, ...newFiles]);
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
              {type === "video" && (
                <>
                  <CFormLabel>Videolar *</CFormLabel>
                  {videoFields.map(
                    (
                      field,
                      index // `key` olaraq field.id istifadə olunur
                    ) => (
                      <div key={field.id} className="mb-3 p-3 border rounded">
                        <CFormLabel>Video URL {index + 1} *</CFormLabel>
                        <CFormInput
                          type="text"
                          {...register(`videos.${index}.url`)}
                          className="mb-2"
                          placeholder="https://..."
                        />
                        {errors.videos?.[index]?.url && (
                          <p className="text-danger">
                            {errors.videos[index].url.message}
                          </p>
                        )}
                        <CFormLabel>Video Başlığı (opsional)</CFormLabel>
                        <CFormInput
                          type="text"
                          {...register(`videos.${index}.title`)}
                          className="mb-2"
                          placeholder="Video başlığı"
                        />
                        <CButton
                          color="danger"
                          size="sm"
                          type="button"
                          onClick={() => removeVideo(index)}
                        >
                          Sil
                        </CButton>
                      </div>
                    )
                  )}
                  <br />
                  <CButton
                    color="primary"
                    className="mb-3"
                    onClick={() => appendVideo({ title: "", url: "" })}
                  >
                    Video Əlavə Et
                  </CButton>
                  {errors.videos && (
                    <p className="text-danger">{errors.videos.message}</p>
                  )}
                </>
              )}
              <br />
              <div className="flex justify-end">
                <CButton
                  type="submit"
                  color="primary"
                  disabled={updateMutation.isPending || isSubmitting}
                >
                  {updateMutation.isPending || isSubmitting ? (
                    <CSpinner size="sm" />
                  ) : (
                    "Yadda saxla"
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
