import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFeaturedProjects, type ProjectRecord } from "../../lib/backend/projects";
import CursorEyes from "../UI/CursorEyes";

function ProjectPreview({ work }: { work: ProjectRecord }) {
  const hasCoverImage = Boolean(work.media.coverImage?.src);

  return (
    <div className="relative overflow-hidden rounded-[1.45rem] border border-white/[0.08] bg-[#120b22] p-4">
      <div className="absolute inset-0" style={{ background: work.preview }} />

      {hasCoverImage ? (
        <img
          src={work.media.coverImage?.src}
          alt={work.media.coverImage?.alt ?? `${work.client} cover`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      ) : null}

      <div className="section-grid-overlay absolute inset-0 opacity-[0.26]" />
      <div className="retrowave-halo absolute bottom-[-28%] left-1/2 h-[12rem] w-[12rem] -translate-x-1/2 opacity-55" />
      <div className="soft-wave-ribbon absolute left-[6%] top-[16%] h-20 w-44 -rotate-[18deg] opacity-60" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(183,124,255,0.22) 60%, transparent 100%)" }} />

      <div className="relative flex h-full min-h-[13rem] flex-col justify-between">
        <div className="self-end rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 font-mono text-[0.44rem] uppercase tracking-[0.3em] text-white/52">
          {hasCoverImage ? "project media" : "media template"}
        </div>

        <div className="rounded-[1rem] border border-white/[0.08] bg-[rgba(8,5,18,0.46)] p-3 backdrop-blur-xl">
          <div className="font-mono text-[0.42rem] uppercase tracking-[0.3em] text-white/28">project assets</div>
          <div className="mt-2 text-[0.78rem] uppercase tracking-[0.16em] text-white/82">{work.client}</div>
          <div className="mt-3 font-mono text-[0.48rem] uppercase tracking-[0.24em] text-white/40">{work.media.assetDirectory}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {work.media.expectedFiles.map((file) => (
              <span key={file} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-[0.44rem] uppercase tracking-[0.2em] text-white/44">
                {file}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorksSection() {
  const [works, setWorks] = useState<ProjectRecord[]>([]);

  useEffect(() => {
    let active = true;

    void getFeaturedProjects().then((records) => {
      if (active) {
        setWorks(records);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="work" className="relative overflow-hidden bg-transparent text-white">
      <div className="violet-speckles pointer-events-none absolute inset-0 opacity-66" />
      <div className="section-spectrum-backdrop pointer-events-none absolute inset-[-16%] opacity-92" />
      <div className="soft-wave-ribbon pointer-events-none absolute right-[-14%] top-[14%] h-[22rem] w-[38rem] rotate-[18deg] opacity-55 md:h-[28rem] md:w-[54rem]" style={{ background: "linear-gradient(120deg, rgba(126,242,255,0.04) 0%, rgba(183,124,255,0.22) 46%, rgba(255,118,207,0.06) 100%)" }} />
      <div className="flow-contour pointer-events-none absolute inset-x-[6%] bottom-[12%] top-[12%] opacity-[0.1]" />
      <div className="section-grid-overlay pointer-events-none absolute inset-0 opacity-[0.08]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-24 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[0.56rem] uppercase tracking-[0.42em] text-[#c8b8ff]/62"
            >
              Work // selected night shifts
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-speed text-[clamp(3rem,7.8vw,6.2rem)] font-black italic uppercase leading-[0.9] tracking-[-0.05em] text-white/95"
            >
              Selected builds
              <br />
              with a <span className="hero-gradient-word">pulse.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.66, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-[0.94rem] leading-[1.9] tracking-[0.08em] text-white/56"
            >
              A few projects where strategy, interface design, and motion were treated as one system instead of three separate tracks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="section-glass-card section-signal-panel mt-8 rounded-[1.8rem] p-6"
            >
              <div className="flex items-center gap-4">
                <CursorEyes size="sm" tint="rose" />
                <div>
                  <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-[#ffd0e8]/72">Interfaces that watch back</div>
                  <p className="mt-2 text-[0.78rem] leading-[1.75] text-white/52">
                    Each case study is shown as a live signal, not a static poster. The same softness from the hero carries through here.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            {works.map((work, index) => (
              <motion.article
                key={work.id}
                initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.72, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="section-glass-card group overflow-hidden rounded-[1.85rem] p-5 md:p-6"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-stretch">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[0.5rem] uppercase tracking-[0.34em] text-white/32">{work.number} / {String(works.length).padStart(2, "0")}</div>
                        <div className="mt-2 font-mono text-[0.5rem] uppercase tracking-[0.24em] text-white/24">{work.client} · {work.year}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-[clamp(1.8rem,3vw,2.8rem)] font-black leading-none" style={{ color: work.accent }}>
                          {work.metric}
                        </div>
                        <div className="mt-1 font-mono text-[0.44rem] uppercase tracking-[0.26em] text-white/24">{work.metricLabel}</div>
                      </div>
                    </div>

                    <h3 className="mt-6 whitespace-pre-line text-[clamp(1.6rem,3vw,2.6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white/94">
                      {work.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-[0.82rem] leading-[1.85] text-white/52">{work.description}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span key={tag} className="section-pill text-white/48">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ProjectPreview work={work} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
 
