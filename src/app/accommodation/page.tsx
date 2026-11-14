"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { getAnnouncements } from "@lib/api";
import type { AnnouncementRecord } from "@/types/announcementTypes";
import type { InformationCategory } from "@/components/assets/information";

type AccommodationPageProps = {
  className?: string;
};

export default function Accomodation({
  className = "",
}: AccommodationPageProps) {
  const [announcements, setAnnouncements] = useState<
    AnnouncementRecord[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAnnouncements();

        setAnnouncements(data);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load accommodation updates.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchAnnouncements();

    return () => controller.abort();
  }, []);

  const filterByCatAccomodation: AnnouncementRecord[] =
    announcements?.filter(
      (item) => item.category === "accommodation",
    ) ?? [];

  const informationData: InformationCategory[] = [
    {
      type: "accommodation",
      title: "Accommodation",
      description:
        "Accommodation updates, hostel information, residence guidelines, and official announcements.",
      link: "/accommodation",
      data: filterByCatAccomodation,
    },
  ];

  return (
    <div
      className={`w-full bg-paper-line dark:bg-ink ${className}`}
    >
      {informationData.map((item, index) =>
        item.type === "accommodation" ? (
          <section
            key={index}
            className="w-full rounded-2xl border border-paper-line bg-paper px-4 py-10 sm:px-6 md:px-10 md:py-14 dark:border-ink-line dark:bg-ink"
          >
            <header className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-2xl font-bold leading-tight text-ink sm:text-3xl dark:text-paper">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-ink/65 sm:text-base dark:text-paper/65">
                {item.description}
              </p>
            </header>

            {error && (
              <div
                role="alert"
                className="mx-auto mt-8 max-w-2xl rounded-2xl border border-paper-line bg-paper-soft p-5 text-sm text-ink/70 dark:border-ink-line dark:bg-ink-soft dark:text-paper/70"
              >
                {error}
              </div>
            )}

            {loading ? (
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((placeholder) => (
                  <div
                    key={placeholder}
                    className="h-72 animate-pulse rounded-2xl border border-paper-line bg-paper-soft dark:border-ink-line dark:bg-ink-soft"
                  />
                ))}
              </div>
            ) : filterByCatAccomodation.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filterByCatAccomodation
                  .slice(0, 4)
                  .map((news) => (
                    <article
                      key={news.id}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border border-paper-line bg-paper-soft shadow-sm transition hover:shadow-md dark:border-ink-line dark:bg-ink-soft"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-line dark:bg-ink">
                        {news.image_url ? (
                          <Image
                            src={news.image_url}
                            alt={
                              news.title ??
                              item.description
                            }
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-paper-line dark:bg-ink">
                            <span className="text-xs font-medium text-ink/45 dark:text-paper/45">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col p-5">
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-200">
                            {news.created_at
                              ? new Date(
                                  news.created_at,
                                ).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "Recent update"}
                          </p>

                          <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-ink dark:text-paper">
                            {news.title}
                          </h3>

                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65 dark:text-paper/65">
                            {news.summary ??
                              news.content ??
                              "Read the full announcement for details."}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-paper-line pt-4 dark:border-ink-line">
                          <Link
                            href={`/jamb/${news.slug}`}
                            className="text-xs font-semibold text-gold-700 transition hover:text-gold-600 dark:text-gold-200 dark:hover:text-gold-100"
                          >
                            View details
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/jamb/${news.slug}`;
                            }}
                            className="rounded-full border border-gold-400 bg-gold-metal-soft px-4 py-2 text-xs font-bold text-ink transition hover:bg-gold-400/20 dark:border-gold-400/50 dark:text-paper"
                          >
                            Read more
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-paper-line bg-paper-soft p-10 text-center dark:border-ink-line dark:bg-ink-soft">
                <h3 className="font-display text-xl font-bold text-ink dark:text-paper">
                  No accommodation updates yet
                </h3>

                <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">
                  New accommodation announcements will appear here
                  when they are published.
                </p>
              </div>
            )}
          </section>
        ) : null,
      )}
    </div>
  );
}

// "use client"
// import {Metadata} from "next";
// import {useState, useEffect} from "react";
// import {getAnnouncements} from "@lib/api";
// import Image from "next/image";
// import Link from "next/link";
// import type { AnnouncementRecord } from "@/types/announcementTypes";
// import type {InformationCategory} from "@/components/assets/information";


// export default function Accomodation() {
//   const [announcements, setAnnouncements] = useState<AnnouncementRecord[] | null>(null);

//   useEffect(()=> {
//     async function fetchAnnouncements(){
//       const data = await getAnnouncements()
//       setAnnouncements(data)
//       console.log(data);
//     }
//     fetchAnnouncements()
//   },[])

//   const filterByCatAccomodation : AnnouncementRecord[] =  announcements?.filter((item)=> item.category === "accommodation") || []


//   console.log("filterByCatAccomodation", filterByCatAccomodation)
 
  
//   const informationData: InformationCategory[] = [
//     {
//       type: "accommodation",
//       title: "Accommodation",
//       description: "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",
  
//       link : "/accommodation",
//     data: filterByCatAccomodation
//     },

//   ];
//   return (
// <div className="bg-paper-line w-full flex flex-col h-auto">
//     {informationData?.map((item, index)=> (
//         item?.type === "accommodation" && (
//    <div key={index}
              
//                 className={`w-full  rounded-md border-1 border-gray-100 
//                     overflow-y-hidden item-card px-10 
//                    ${index == 0 || index === 2 ? "bg-paper-soft" : index === 1 || index === 3 ? "bg-paper-line" : ""}
//                       flex-shrink-0 basis-full bg-paper p-8
//                  dark:bg-ink h-full flex flex-col gap-10 py-15 `}
//               >
//                 <h2 className="text-[30px] leading-tight text-current/80 text-center font-bold">

//                  {item?.title}
//                  </h2>
//               <div className="flex flex-col lg:flex-row gap-5 lg:h-[450px] w-full">
//                                  {item?.data?.length > 0 ? (
//                                    item?.data?.map((news, i)=> (
//                                      i < 4  && (
//                  <div  className={`   ${i !== 0 ? "hidden lg:block" : ""} border-[3px] shadow-md 
//                      border-gray-100 rounded-xl  lg:w-1/4 `} 
//                                  key={i}>
             
//                               <div className=" w-full h-1/3  ">
//                                 {news?.image_url?.length ? (
//                               <Image width={400} height={400} className={"object-cover w-full h-full"} 
//                               src={news.image_url} alt={item?.description}/>
//                                 ) : (
//                                  <div className="w-full h-full bg-gray-200"/>
//                                 )}
//                               </div>
//                                 <div className="h-[67.333%] w-full  p-4 flex flex-col justify-between overflow-y-hidden">
//                                  <div className="h-full">
//                                  <h2 className="lg:text-[16px] lg:leading-[20px] text-[13px] leading-[18x] font-semibold text-current/80">
//                {news?.title}
//                                  </h2> 
//                                <i className="text-sm text-current/70">
//                                  {news?.summary ? `${news?.summary?.slice(0, 100)}...` : ""}
//                                </i>
//                                <p> 
//                                  { `${news?.content?.slice(0, 100)}...` || ""}

//                                </p>
//                                </div>
//                                <p className="text-[10px]  font-semibold">
//                               {news?.created_at ? new Date(news?.created_at).toString()?.slice(4, news?.created_at?.length -16) : ""}
//                                 </p>
//                                  <Link href={`/jamb/${news?.slug}`} 
//                                             className="text-sm text-color-gold-metal
//                                              text-end">
//                                             Read more
//                                             </Link>
//                                 </div>
                          
   
//                                   </div>
//                                     ) ))): (
//                                      <div className="">
//                                        </div>
//                                     )}
//                                     </div>

               
//               </div>
//                     )
// ))}
//            </div>
//   );
// }