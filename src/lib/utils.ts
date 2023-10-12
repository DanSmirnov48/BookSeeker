import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ExampleInput {
  title: string;
  author?: string;
  year?: number,
  description: string;
}

export function limitDescription(description: string, maxLength: number): string {
  if (description.length <= maxLength) {
    return description;
  } else {
    return `${description.substring(0, maxLength)}...`;
  }
}

export function getRandomBookFromArray(): ExampleInput | undefined {
  if (ExampleInput.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * ExampleInput.length);
  return ExampleInput[randomIndex];
}

export const ExampleInput: ExampleInput[] = [
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J. K. Rowling",
    year: 1997,
    description: "It's all about this kid, Harry, who finds out he's a wizard and goes to this cool school for wizards. He makes friends, learns magic, and faces off against the evil Voldemort."
  },
  {
    title: "1984",
    author: "George Orwell",
    year: 1949,
    description: "The story is set in a totalitarian society where the government closely monitors and controls every aspect of citizens' lives. It follows an individual who begins to rebel against the regime's surveillance and oppression, seeking personal freedom despite the severe consequences for disobedience. Themes explored include government control, propaganda, and the struggle for individual liberty."
  },
  {
    title: "The Chronicles of Narnia",
    author: "C.S. Lewis",
    year: 1956,
    description: "It's a story about a group of young individuals who unexpectedly enter a hidden, enchanted world. There, they interact with talking creatures, confront challenges, and get caught up in a conflict between opposing forces. The narrative delves into themes of bravery, camaraderie, and the struggle between right and wrong, all within a captivating and fantastical setting."
  },
  {
    title: "The Old Man and the Sea",
    author: "Ernest Hemingway",
    year: 1952,
    description: "It's a tale about an elderly individual who embarks on a solitary journey at sea. He faces a mighty adversary from the depths and engages in a relentless battle. Through his determination and resilience, he attempts to conquer the enormous challenge. The story explores themes of endurance, courage, and the connection between humans and the natural world, all set against the backdrop of the vast ocean."
  }
];

export const genres = [
  {
    value: "fiction",
    label: "Fiction",
  },
  {
    value: "science_fiction",
    label: "Science Fiction",
  },
  {
    value: "fantasy",
    label: "Fantasy",
  },
  {
    value: "romance",
    label: "Romance",
  },
  {
    value: "horror",
    label: "Horror",
  },
  {
    value: "biography",
    label: "Biography",
  },
  {
    value: "novel",
    label: "Novel",
  },
];