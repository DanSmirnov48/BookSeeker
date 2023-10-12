"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { useCompletion } from "ai/react";
import { CheckIcon, Loader2, ChevronsUpDown } from "lucide-react";
import Books from "./Books";
import { Input } from "./ui/input";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, genres } from "@/lib/utils";
import { Toaster, toast } from "sonner";
import getBookInfo from "../lib/getBookInfo";
import Typewriter from "typewriter-effect";

export default function Description() {

  interface BookState {
    books: BookInfo[];
  }

  interface BookInfo {
    title: string;
    author: string;
    releaseYear: string;
    description: string;
    previewLink: string;
    imageUrl: string | null;
  }

  interface FormValues {
    description: string;
    author: string;
    year: string;
  }

  const [bookState, setBookState] = useState<BookState>({ books: [] });
  const completionApi = "/api/generate";
  const [open, setOpen] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  const [formData, setFormData] = useState<FormValues>({
    description: "",
    author: "",
    year: "",
  });

  const { complete, completion, isLoading } = useCompletion({
    api: completionApi,
    onFinish: async (_prompt, completion) => {
      if (completion === "No Book Found") {
        toast.error("Book not found!", {
          duration: 5000,
          position: "top-center",
          description: "Please try prodiving more details, or add an author.",
        });
        return;
      }
      const bookArray: string[] = completion.split(/\s*,\s*/).slice(0, 3);
      const bookInfoPromises = bookArray.map((book) => getBookInfo(book));
      const bookInfos: (BookInfo | null)[] = await Promise.all(
        bookInfoPromises
      );
      setBookState({ books: bookInfos as BookInfo[] });
    },
    onError: (err) => {
      toast.error("Unknown error: " + err);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let searchTerm: string = formData.description;

    if (formData.description === "") {
      toast.error("Please provide book description");
      return;
    }

    if (formData.author !== "") {
      searchTerm = formData.description.concat(
        ` Presumed author of this book is ${formData.author}.`
      );
    }
    if (formData.year !== "") {
      searchTerm = formData.description.concat(
        ` Presumed publication year of this book is ${formData.year}.`
      );
    }
    if (genreInput !== "") {
      searchTerm = formData.description.concat(
        ` Presumed genre of this book is ${genreInput}.`
      );
    }

    complete(searchTerm);
  };

  return (
    <>
      <Toaster richColors closeButton position="bottom-right" />

      <div className="grid w-full gap-2 mt-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row place-items-center gap-4 my-4">
            <Input
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              type="text"
              placeholder="Author (if known)"
              className="w-1/3"
            />
            <Input
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              type="text"
              placeholder="Year (if known)"
              className="w-1/5"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {genreInput
                    ? genres.find((genres) => genres.value === genreInput)
                        ?.label
                    : "Genre"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandGroup>
                    {genres.map((genres) => (
                      <CommandItem
                        key={genres.value}
                        onSelect={(currentValue) => {
                          setGenreInput(
                            currentValue === genreInput ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        {genres.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            genreInput === genres.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Textarea
            value={formData.description}
            id="textarea"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Book description"
          />
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Process
          </Button>
        </form>
      </div>

      <div className="w-full h-auto mt-10">
        {bookState.books.length > 0 && (
          <>
            <h1>Based on your description, this is what we found</h1>
            <Books books={bookState.books} />
          </>
        )}
      </div>
    </>
  );
}
