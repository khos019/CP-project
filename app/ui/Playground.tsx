"use client";

import { useState } from "react";
import { catalogue } from "./i18n";
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

const T = catalogue("playground");

const Ic = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const I_CLOCK = "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z";
const I_CHIP = "M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4";
const I_KEY = "M3 7h18v10H3zM7 11h.01M11 11h.01M15 11h.01M8 14h8";
const I_IN = "M12 3v12M7 10l5 5 5-5M5 21h14";
const I_OUT = "m5 7 5 5-5 5M12 17h7";

export function Playground({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [codeLang, setCodeLang] = useState<"cpp20" | "python3">("cpp20");
  /* One buffer per language, so switching tabs never carries C++ into the
     Python file or loses what was written in either. */
  const [codes, setCodes] = useState<Record<"cpp20" | "python3", string>>({ cpp20: STARTERS.cpp20, python3: STARTERS.python3 });
  const code = codes[codeLang];
  const setCode = (next: string) => setCodes((prev) => ({ ...prev, [codeLang]: next }));
  const [stdin, setStdin] = useState("12 30\n");
  const [out, setOut] = useState<{ stdout: string; stderr: string; status: string; runtimeMs: number; memoryKb: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const switchLang = (next: "cpp20" | "python3") => setCodeLang(next);

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
          <h1 className="page-title">{t.title}</h1>
          <p className="muted">{t.sub}</p>
        </div>
        <div className="play-limits">
          <span><Ic d={I_CLOCK} />5 s</span>
          <span><Ic d={I_CHIP} />256 MB</span>
          <span className="play-kbd"><Ic d={I_KEY} /><kbd>Ctrl</kbd>+<kbd>Enter</kbd></span>
        </div>
      </div>

      <div className="play-grid" data-zone="tool">
        <CodeEditor
          code={code} setCode={setCode}
          lang={codeLang} setLang={switchLang}
          onSubmit={run} submitLabel={t.run} busy={busy}
          verdict={out?.status ? `${out.status} · ${out.runtimeMs} ms · ${out.memoryKb} KB` : ""}
          extraAction={<button className="ghost ide-reset" onClick={() => setCode(STARTERS[codeLang])}>{t.reset}</button>}
          minHeight={420}
        />

        <aside className="play-side">
          <div className="panel play-io">
            <div className="play-io-head">
              <h3><Ic d={I_IN} />{t.input}</h3>
              {stdin && <button className="play-clear" onClick={() => setStdin("")}>{lang === "uz" ? "Tozalash" : "Clear"}</button>}
            </div>
            <textarea aria-label={t.input} value={stdin} onChange={e => setStdin(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel play-io play-out${busy ? " busy" : ""}`}>
            <div className="play-io-head">
              <h3><Ic d={I_OUT} />{t.output}</h3>
              {/* The run's outcome at a glance: status, then the cost. */}
              {out && !busy && (out.status || out.runtimeMs > 0) && (
                <span className="play-result">
                  {out.status && <i className={`play-status ${/accept|ok|success/i.test(out.status) ? "ok" : "bad"}`}>{out.status}</i>}
                  <i className="mono">{out.runtimeMs} ms</i>
                  <i className="mono">{out.memoryKb} KB</i>
                </span>
              )}
            </div>
            <pre className={out?.stdout ? "" : "muted"}>{busy ? t.running : out?.stdout || t.empty}</pre>
          </div>
          {out?.stderr && (
            <div className="panel play-io play-err">
              <h3>{t.errors}</h3>
              <pre>{out.stderr}</pre>
            </div>
          )}
          <p className="play-note muted">{t.note}</p>
        </aside>
      </div>
    </>
  );
}
