import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex justify-center mt-5 space-x-3">
      <h1 className="text-purple-300 text-4xl">Next.js</h1>
      <ModeToggle />
    </main>
  );
}
