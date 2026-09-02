"use client";

import { useState } from "react";
import { CodeEditor } from "./CodeEditor";

// A plain compiler: write code, give it your own input, see what it prints.
//
// Deliberately not a judge — there is no expected output and no verdict, and
// it cannot reach the hidden tests. It exists for the step before submitting:
// trying an idea, checking a formula, watching what a loop actually does.

type Lang = "uz" | "en";

const STARTERS = {
  cpp20: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int a, b;
    cin >> a >> b;
    cout << a + b << "\\n";
    return 0;
}
`,
  python3: `import sys
input = sys.stdin.readline

a, b = map(int, input().split())
print(a + b)
`,
};

const T = {
  uz: {
    title: "Kompilyator", sub: "Kodni yozing, o‘z kirishingizni bering va natijani ko‘ring.",
    eyebrow: "Kompilyator", run: "Ishga tushirish", running: "Ishlamoqda…",
    input: "Kirish (stdin)", output: "Chiqish (stdout)", errors: "Xatolar",
    empty: "Hali ishga tushirilmadi.", reset: "Boshlang‘ich kod",
    time: "vaqt", mem: "xotira", note: "Bu tekshiruvchi emas — verdikt qo‘yilmaydi, faqat dastur chiqishi ko‘rsatiladi.",
    failed: "Kompilyatorga ulanib bo‘lmadi.",
  },
  en: {
    title: "Compiler", sub: "Write code, feed it your own input, see what it prints.",
    eyebrow: "Kompilyator", run: "Run", running: "Running…",
    input: "Input (stdin)", output: "Output (stdout)", errors: "Errors",
    empty: "Nothing run yet.", reset: "Reset code",
    time: "time", mem: "memory", note: "This is not the judge — no verdict is given, only what your program printed.",
    failed: "Could not reach the compiler.",
  },
};

export function Playground({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [codeLang, setCodeLang] = useState<"cpp20" | "python3">("cpp20");
  const [code, setCode] = useState(STARTERS.cpp20);
  const [stdin, setStdin] = useState("12 30\n");
  const [out, setOut] = useState<{ stdout: string; stderr: string; status: string; runtimeMs: number; memoryKb: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const switchLang = (next: "cpp20" | "python3") => {
    setCodeLang(next);
    // Only replace the buffer when it is still an untouched starter, so a
    // language switch never eats work in progress.
    if (code.trim() === STARTERS.cpp20.trim() || code.trim() === STARTERS.python3.trim()) setCode(STARTERS[next]);
  };

  const run = async () => {
    setBusy(true);
    setOut(null);
    try {
      const response = await fetch("/api/judge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "run", language: codeLang, sourceCode: code, stdin }),
      });
      const data = await response.json();
      setOut(response.ok
        ? { stdout: data.stdout || "", stderr: data.stderr || "", status: data.status || "", runtimeMs: data.runtimeMs || 0, memoryKb: data.memoryKb || 0 }
        : { stdout: "", stderr: data.error || t.failed, status: "", runtimeMs: 0, memoryKb: 0 });
    } catch {
      setOut({ stdout: "", stderr: t.failed, status: "", runtimeMs: 0, memoryKb: 0 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow" style={{ color: "#637068" }}>{t.eyebrow}</p>
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.sub}</p>
        </div>
        <span className="muted mono">5 s · 256 MB</span>
      </div>

      <div className="play-grid">
        <CodeEditor
          code={code} setCode={setCode}
          lang={codeLang} setLang={switchLang}
          onSubmit={run} submitLabel={`${t.run} ▶`} busy={busy}
          verdict={out ? `${out.status} · ${out.runtimeMs} ms · ${out.memoryKb} KB` : ""}
          extraAction={<button className="ghost ide-reset" onClick={() => setCode(STARTERS[codeLang])}>{t.reset}</button>}
          minHeight={420}
        />

        <aside className="play-side">
          <div className="panel play-io">
            <h3>{t.input}</h3>
            <textarea aria-label={t.input} value={stdin} onChange={e => setStdin(e.target.value)} spellCheck={false} />
          </div>
          <div className="panel play-io">
            <h3>{t.output}</h3>
            <pre className={out?.stdout ? "" : "muted"}>{out?.stdout || t.empty}</pre>
          </div>
          {out?.stderr && (
            <div className="panel play-io play-err">
              <h3>{t.errors}</h3>
              <pre>{out.stderr}</pre>
            </div>
          )}
          <p className="muted" style={{ fontSize: 12.5 }}>{t.note}</p>
        </aside>
      </div>
    </>
  );
}
