import { join } from "node:path";
import { plainAddPlaceholder } from "@signpdf/placeholder-plain";
import { P12Signer } from "@signpdf/signer-p12";
import signpdf from "@signpdf/signpdf";
import { parse } from "csv-parse/sync";
import forge from "node-forge";
import PDFDocument from "pdfkit";
import svgtopdf from "svg-to-pdfkit";
import { Builder, parseStringPromise } from "xml2js";

export default async function ParseAction(
	options: ParseOptions,
): Promise<void> {
	// Load the SVG template as a string
	const { xmlTemplate, svg } = await readSVGTemplate(options.template);

	// Get the header and records from the CSV file
	const [header, ...records] = await readCSV(options.csv);

	// For each record in the CSV file
	for (const record of records) {
		// Replace the {{placeholders}} in the SVG template with the record data
		const newSvg = replacePlaceholders(svg, header, record);

		// Create a new PDF document
		const doc = await createPDFDocument(xmlTemplate);

		// Resolve the PDF document buffer when the document is ready
		const pdfBufferReady: Promise<Buffer> = new Promise((resolve) => {
			// Create a buffer to store the PDF document
			const pdfChunks: Uint8Array[] = [];

			doc.on("data", (data) => {
				// Append the PDF document data to the buffer
				pdfChunks.push(data);
			});

			doc.on("end", () => {
				// Resolve the promise with the PDF document buffer
				resolve(Buffer.concat(pdfChunks));
			});
		});

		// Register the font in the PDF document
		await registerFonts(doc);

		// Write the SVG template to the PDF document
		svgtopdf(doc, newSvg, 0, 0);

		// Sign the PDF document when it is ready
		pdfBufferReady.then(async (pdfBuffer) => {
			// Sign the PDF document with the P12 signer
			const signedPdf = await signPDF(options, pdfBuffer);

			// Write the signed PDF document to the output directory
			Bun.write(
				`${options.output}/${record[2]}.pdf`,
				new Uint8Array(signedPdf),
			);
		});

		// End the PDF document (this will trigger the "end" event)
		doc.end();
	}
}

interface ParseOptions {
	template: string;
	csv: string;
	p12: string;
	output: string;
	password: string;
	reason: string;
}

async function readSVGTemplate(template: string) {
	// Load the SVG template as a string
	const xmlStringTemplate = await Bun.file(template).text();

	// Parse the SVG template as an object
	const xmlTemplate: {
		svg: {
			$: { width: number; height: number };
			defs: { clipPath: unknown }[];
		};
	} = await parseStringPromise(xmlStringTemplate);

	// Fix the SVG template (bug from Figma)
	const svg = fixDuplicateStyleSVG(fixClipPathSVG(xmlTemplate));

	return { xmlTemplate, svg };
}

function fixDuplicateStyleSVG(xmlTemplate: object): string {
	// Create a new SVG template builder
	const builder = new Builder();
	// Build the SVG template object back to a string
	const svg = builder.buildObject(xmlTemplate);

	return svg;
}

function fixClipPathSVG(xmlTemplate: {
	svg: { defs: { clipPath: unknown }[] };
}): object {
	// Remove the clip-path attribute from the SVG template
	xmlTemplate.svg.defs[0].clipPath = undefined;

	return xmlTemplate;
}

async function readCSV(csvPath: string): Promise<string[][]> {
	// Load the CSV file as a string
	const parser: string[][] = parse(await Bun.file(csvPath).text(), {
		trim: true,
	});

	return parser;
}

function replacePlaceholders(svg: string, header: string[], record: string[]) {
	// Replace the {{placeholders}} in the SVG template with the record data
	let newSvg = svg;

	// For each field in the record
	for (const [index, field] of record.entries()) {
		// Replace the placeholder with the field value
		newSvg = newSvg.replace(`{{${header[index]}}}`, field);
	}

	return newSvg;
}

async function createPDFDocument(xmlTemplate: {
	svg: { $: { width: number; height: number } };
}): Promise<PDFKit.PDFDocument> {
	const doc = new PDFDocument({
		// Set the document size to 3/4 of the original SVG template size (not sure why)
		size: [
			(Number(xmlTemplate.svg.$.width) * 3) / 4,
			(Number(xmlTemplate.svg.$.height) * 3) / 4,
		],
	});

	return doc;
}

async function registerFonts(doc: typeof PDFDocument) {
	// Register the font in the PDF document
	doc.registerFont(
		"Inter",
		await Bun.file(
			join(__dirname, "../../resources/fonts/Inter-VariableFont_opsz,wght.ttf"),
		).bytes(),
	);
}

async function signPDF(options: ParseOptions, pdfBuffer: Buffer) {
	// Load the P12 file as a buffer
	const p12ArrayBuffer = await Bun.file(options.p12).arrayBuffer();
	// Load the P12 file as a signer
	const signer = new P12Signer(Buffer.from(p12ArrayBuffer), {
		passphrase: options.password,
	});
	// Get the certificate information from the P12 file
	const certificateInfo = getCertificateInfo(options, p12ArrayBuffer);

	// Add a invisible placeholder to the PDF document
	const pdfWithPlaceholder = plainAddPlaceholder({
		pdfBuffer,
		reason: "Certificado",
		contactInfo: certificateInfo.contactInfo,
		name: certificateInfo.name,
		location: certificateInfo.location,
	});

	// Sign the PDF document with the P12 signer
	const signedPdf = await signpdf.sign(pdfWithPlaceholder, signer);

	return signedPdf;
}

function getCertificateInfo(options: ParseOptions, p12Buffer: ArrayBuffer) {
	// Convert the buffer to a forge p12 object
	const p12Asn1 = forge.asn1.fromDer(forge.util.createBuffer(p12Buffer));
	const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, options.password);

	// Extract the certificate
	const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });

	// Get the certificate from the certificate bags
	const cert = (certBags[forge.pki.oids.certBag] as forge.pkcs12.Bag[])[0]
		.cert as forge.pki.Certificate;

	const countryName = cert.subject.getField("C").value;
	const stateProvinceName = cert.subject.getField("ST").value;
	const localityName = cert.subject.getField("L").value;
	const organizationName = cert.subject.getField("O").value;
	const emailAddress = cert.subject.getField("E").value;

	return {
		name: organizationName,
		location: `${localityName}, ${stateProvinceName} - ${countryName}`,
		contactInfo: emailAddress,
	};
}
