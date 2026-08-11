// Bu fayl artıq Server Component-dir. "use client" silindi.

// Təsəvvür edək ki, bu funksiyalar API-dan məlumatları çəkir.
// Onları birbaşa serverdə `await` ilə çağırırıq.
import { getSliders, getArticles, getVideoContent } from "@/@lib/data-fetchers";
import HomePageClient from "./HomePageClient"; // İnteraktiv hissələri bura köçürəcəyik

export default async function Home() {
  // Məlumatlar serverdə paralel olaraq çəkilir
  const [
    slidersData,
    articlesData,
    lessonsData,
    sermonsData,
    trainingsData,
    speechesData,
  ] = await Promise.all([
    getSliders(),
    getArticles(),
    getVideoContent(0), // lessons
    getVideoContent(1), // sermons
    getVideoContent(3), // trainings
    getVideoContent(2), // speeches
  ]);

  // Mürəkkəb ORM obyektlərini sadə JSON obyektlərinə çeviririk.
  const plainData = (data: any) => JSON.parse(JSON.stringify(data));

  // Çəkilmiş məlumatları Client Component-ə props kimi ötürürük
  return (
    <HomePageClient
      initialSliders={plainData(slidersData)}
      initialArticles={plainData(articlesData)}
      initialLessons={plainData(lessonsData)}
      initialSermons={plainData(sermonsData)}
      initialTrainings={plainData(trainingsData)}
      initialSpeeches={plainData(speechesData)}
    />
  );
}
