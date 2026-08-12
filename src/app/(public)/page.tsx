// Bu fayl artıq Server Component-dir. "use client" silindi.

// Təsəvvür edək ki, bu funksiyalar API-dan məlumatları çəkir.
// Onları birbaşa serverdə `await` ilə çağırırıq.
import {
  getSliders,
  getSelectedVideoContent,
  fetchSelectedArticles,
} from "@/@lib/data-fetchers";
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
    fetchSelectedArticles(),
    getSelectedVideoContent(0), // lessons
    getSelectedVideoContent(1), // sermons
    getSelectedVideoContent(3), // trainings
    getSelectedVideoContent(2), // speeches
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
