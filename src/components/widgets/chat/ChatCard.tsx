import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/lib/types/chat";

const chatData: Chat[] = [
  {
    avatar: "/images/user/user-01.png",
    name: "Ehtisham",
    text: "I am having problems with my knees?",
    time: 12,
    textCount: 3,
    dot: 3,
  },

];

const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Patient Bot History
      </h4>

      <div>
        {chatData.map((chat, key) => (
          <Link
            href="/dashboard"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 bg-graydark rounded-full">
              {/*<Image*/}
              {/*  width={56}*/}
              {/*  height={56}*/}
              {/*  src={chat.avatar}*/}
              {/*  alt="User"*/}
              {/*  style={{*/}
              {/*    width: "auto",*/}
              {/*    height: "auto",*/}
              {/*  }}*/}
              {/*/>*/}
              {/*<span*/}
              {/*  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${*/}
              {/*    chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`*/}
              {/*  } `}*/}
              {/*></span>*/}
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {chat.text}
                  </span>
                  <span className="text-xs"> . {chat.time} min</span>
                </p>
              </div>
              {/*{chat.textCount !== 0 && (*/}
              {/*  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">*/}
              {/*    <span className="text-sm font-medium text-white">*/}
              {/*      {" "}*/}
              {/*      {chat.textCount}*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
