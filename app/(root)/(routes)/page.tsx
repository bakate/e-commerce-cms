import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="mt-5 space-x-3">
      <div className="flex justify-center">
        <h1 className="text-purple-300 text-4xl">Next.js</h1>
        <ModeToggle />
      </div>
      <p>This is a protected page</p>
    </main>
  );
}
