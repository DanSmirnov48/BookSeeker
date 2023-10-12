"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { limitDescription } from "@/lib/utils";

interface BookInfo {
  title: string;
  author: string;
  releaseYear: string;
  description: string;
  previewLink: string;
  imageUrl: string | null;
}

type Props = { books: BookInfo[] };

const Books = ({ books }: Props) => {
  return (
    <div className="flex flex-col">
      {books.map((book, index) => (
        <Card
          className=" w-full my-4 grid grid-rows-3 grid-flow-col gap-2" id={"" + index} >
          <div className="row-span-3 ...">
            <Image
              // @ts-ignore
              src={book.imageUrl}
              alt={book.title}
              width={250}
              height={350}
              quality={100}
              className="rounded-md bg-white p-2 sm:p-1 md:p-2 shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
          <div className="col-span-2">
            <CardHeader className="text-left">
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>
                Written by{" "}
                <span className="font-semibold text-base">{book.author}</span>{" "}
                {/* in {new Date(book.releaseYear).getFullYear()} */}
              </CardDescription>
            </CardHeader>
          </div>
          <div className="row-span-2 col-span-1 text-left">
            <CardContent>{limitDescription(book.description, 700)}</CardContent>
            <CardFooter>
              <a
                href={book.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2"
              >
                View on Google Books
              </a>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Books;
