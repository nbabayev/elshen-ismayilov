"use client";
import Button from "@/app/components/atoms/Button/Button";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import Gallery from "@/app/components/molecules/Gallery/Gallery";
import Section from "@/app/components/molecules/Section/Section";
import Subscription from "@/app/components/molecules/Subscription/Subscription";
import Container from "@/app/components/shared/Container";
// import Breadcrumb from "@/components/molecules/BreadCrumb/breadcrumb";
import SafeHtml from "@/app/components/shared/DomPurify";
import { useAbout } from "@/app/hooks/useAbout";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function AboutPage({ params }) {
  const pathname = usePathname();
  let data = {};
  const tabs = [
    {
      id: "1",
      label: "Təhsil",
      content: <SafeHtml html={data?.data?.education} />,
    },
    {
      id: "2",
      label: "Fəaliyyət",
      content: <SafeHtml html={data?.data?.activity} />,
    },
    {
      id: "3",
      label: "Kitablar",
      content: <SafeHtml html={data?.data?.books} />,
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const [id, setId] = useState("");
  return (
    <>
      <Breadcrumb page={pathname} />
      <div className="grid md:grid-cols-[420px_480px]  grid-cols-[100%] gap-15 mb-20">
        <div>
          {
            <img
              // className={styles.logo}
              // src={`http://localhost:3001/uploads/${data?.data?.poster}`}
              src="/images/about.jpg"
              alt="Next.js logo"
              className="w-full h-[360px] object-cover"
            />
          }
        </div>
        <div className="font-[lexend]">
          <div>
            <img src="/images/about-logo.svg" alt="" className="w-full" />
          </div>
          {/* <div>
              {tabs.map((tab) => (
                <Button key={tab.id} onClick={() => setActiveTab(tab.id)}>
                  {tab?.label}
                </Button>
              ))}
            </div> */}
          {/* <div>
              {tabs.map((tab) =>
                tab.id === activeTab ? (
                  <div key={tab.id}>{tab.content}</div>
                ) : null
              )}
            </div> */}
          <p className="font-bold mt-9">Elşən İsmayılov</p>
          <p className="text-[#606060]">
            İlahiyyatçı, islamşünas, teoloq, din xadimi, tədqiqatçı və pedaqoq
            olan Elşən İsmayılov “Hikmət” Elm və Tədris Mərkəzinin təsisçisi və
            direktoru olmaqla yanaşı, eyni zamanda bu mərkəzdə Fəlsəfə, Əqaid,
            Əxlaq, İslam tarixi, İrfan, Məhdəviyyət, Quran elmləri və digər
            fundamental İslam elmlərini tədris edir.
          </p>
          <p className="font-bold mt-9">Təhsil və elmi-pedaqoji fəaliyyət</p>
          <p className="text-[#606060]">
            Elşən İsmayılov 2010-cu ildə Bakı İslam Universitetində bakalavr və
            magistr təhsilini uğurla başa vurmuş, paralel olaraq fərdi şəkildə
            elmi səviyyəsini inkişaf etdirmişdir. Elmi fəaliyyətinə erkən
            mərhələdə başlamış, müxtəlif tədris müəssisələrində çalışaraq
            ilahiyyat elmlərinin tədrisi sahəsində zəngin təcrübə qazanmış,
            yüzlərlə tələbənin elmi və mənəvi inkişafına töhfə vermişdir.
          </p>
          <p className="font-bold mt-9">Məscid fəaliyyəti</p>
          <p className="text-[#606060]">
            2014–2023-cü illər ərzində Məşədi Dadaş məscidində imam-camaat və
            ilahiyyatçı kimi fəaliyyət göstərmişdir. Bu dövrdə o, dini
            maarifləndirmə istiqamətində geniş miqyaslı işlər görmüş, təbliğ və
            tədris fəaliyyətini davam etdirmişdir.
          </p>
          <p className="font-bold mt-9">
            <a href="https://hikmet.az" className="text-[blue]">
              “Hikmət”
            </a>{" "}
            Elm və Tədris Mərkəzi
          </p>
          <p className="text-[#606060]">
            2014-cü ildə təsis etdiyi Hikmət Elm və Tədris Mərkəzi, İslam
            elmlərinin sistemli və analitik yanaşma ilə tədrisini hədəf
            götürmüş, eyni zamanda fəlsəfi düşüncənin inkişafına yönəlmiş elmi
            platforma kimi fəaliyyət göstərmişdir. Mərkəz 2023-cü ilə qədər həm
            canlı, həm də virtual dərslərlə yanaşı, seminarlar, mühazirələr və
            elmi tədbirlərin təşkili sahəsində də geniş fəaliyyət göstərmiş,
            2023-cü ildən sonra isə ancaq virtual fəaliyyətini davam etdirmişdi.
            Hal-hazırda Mərkəz, müasir elmi tələblərə cavab verən onlayn tədris
            imkanlarını təqdim edir. Mərkəzdə tədris fəaliyyəti ilə yanaşı, elmi
            təhlillər aparılır, dərs vəsaitləri hazırlanır, həmçinin dini və
            fəlsəfi əsərlər yazılır və tərcümə olunur. Bu istiqamətdə görülən
            işlər, yalnız bilik ötürmək deyil, həm də elmi ədəbiyyatın
            zənginləşdirilməsi və tənqidi düşüncə mədəniyyətinin inkişafı
            baxımından xüsusi əhəmiyyət daşıyır. Mərkəz, daim yenilənən
            metodlara əsaslanaraq tələbələrə müasir və çevik tədris mühiti
            təqdim etməyi qarşısına məqsəd qoymuşdur. Tədrisin keyfiyyəti,
            tələbə məmnuniyyəti və elmi yeniliklərə açıq yanaşma Hikmət
            Mərkəzinin əsas prinsiplərindən biridir.
          </p>
          <p className="font-bold mt-9">Elmi yanaşma və tədris üslubu</p>
          <p className="text-[#606060] mt-9">
            Elşən İsmayılovun elmi yanaşması, vəhyin mahiyyətini müasir insan
            üçün anlaşılan bir dilə çevirmək, dini düşüncəni fəlsəfi, irfani,
            psixoloji, tarixi və sosioloji prizmalardan izah etmək üzərində
            qurulmuşdur. O, dini mətnləri yalnız ənənəvi şərhlərlə deyil, həm də
            müasir düşüncə tələblərinə cavab verən təhlil metodları ilə izah
            edərək, onları həyatın aktual problemləri ilə əlaqələndirir.
            Tədrisində fəlsəfi dərinlik, məntiqi ardıcıllıq, irfani baxış və
            praktik yanaşma əsas yer tutur. Elmi əsaslara söykənən dərsləri,
            çıxışları və xütbələri ilə dinin yalnız formal çərçivədə deyil,
            yaşanan və düşünülən bir konsepsiya kimi təqdiminə çalışır.
          </p>
          <p className="font-bold mt-9">Saytda təqdim olunan materiallar</p>
          <p className="text-[#606060] mt-7">
            Bu sayt vasitəsilə Elşən İsmayılovun aşağıdakı sahələri ehtiva edən
            çoxşaxəli fəaliyyəti ilə tanış ola bilərsiniz:
          </p>
          <p className="text-[#606060] mt-7">
            Müxtəlif mövzularda keçdiyi dərslər;
          </p>
          <p className="text-[#606060] mt-7">
            Eləcə də Cümə xütbələri, həmçinin Ramazan və Məhərrəm aylarına dair
            silsilə xütbələr.
          </p>
          <p className="text-[#606060] mt-7">
            Bu materiallar elmə əsaslanan dini təhlil və maarifləndirmə
            baxımından geniş auditoriyaya xitab etməkdədir.
          </p>
        </div>
      </div>
      <Section
        sectionHeader={
          <SectionHeader label="Qalereya" icon="/icons/gallery.png" />
        }
        content={<Gallery />}
      />
      <div className="bg-[url(/images/pattern2.png)] bg-[#003a3c]">
        <Container>
          <div className="flex justify-center py-20">
            <Subscription titleFont="text-xl" center="text-center" />
          </div>
        </Container>
      </div>
      <Section
        sectionHeader={
          <SectionHeader label="Son məqalələr" icon="/icons/pen.png" />
        }
        content={<Gallery />}
      />
    </>
  );
}
