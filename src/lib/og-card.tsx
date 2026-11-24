/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { OG_IMAGE_SIZE } from "@/lib/seo";

let cachedLogoDataUri: string | null = null;

async function getLogoDataUri() {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  const buffer = await readFile(
    join(process.cwd(), "public/images/luah-about-mark.jpg")
  );
  cachedLogoDataUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  return cachedLogoDataUri;
}

export async function renderBrandOgImage() {
  const logoSrc = await getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0F2137",
          color: "#FFFFFF",
          padding: "64px 72px",
          borderBottom: "10px solid #B08D4F",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={logoSrc}
              width={72}
              height={65}
              alt=""
              style={{ objectFit: "contain" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Luah Partners
              </div>
              <div
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#B08D4F",
                  marginTop: "4px",
                }}
              >
                Every Home, a Blessing
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#DCD5C7",
            }}
          >
            Washington, DC · Maryland
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "58px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Building and stewarding homes in the capital region
          </div>
          <div
            style={{
              fontSize: "24px",
              lineHeight: 1.45,
              color: "#CBD5E1",
            }}
          >
            Acquisition, development, leasing, property management, and licensed
            home improvement across Washington, DC and Maryland.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(220, 213, 199, 0.25)",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#DCD5C7",
          }}
        >
          <span>www.luahpartners.com</span>
          <span>800 800 2911 · Info@luahpartners.com</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
    }
  );
}
