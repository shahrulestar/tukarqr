import type { Messages } from "../types";

export const en: Messages = {
  // nav
  "nav.footer.ariaLabel": "Footer",
  "nav.footer.about": "About",
  "nav.language.ariaLabel": "Choose language",
  "nav.language.ms": "B. Melayu",
  "nav.language.en": "English",
  "nav.back.ariaLabel": "Back",

  // hero
  "hero.brand": "Tukar QR",
  "hero.tagline": "Restore blurry DuitNow QR images to a clear digital QR",

  // upload
  "upload.title": "Upload DuitNow QR",
  "upload.description": "Turn a blurry photo into a clear digital QR",
  "upload.tab.upload": "Upload",
  "upload.tab.camera": "Camera",
  "upload.dropzone.title": "Drop your DuitNow QR image here",
  "upload.dropzone.hint.desktop": "or press {mod}+V to paste",
  "upload.dropzone.hint.mobile": "or choose from your gallery",
  "upload.dropzone.pasteButton": "Paste image",
  "upload.dropzone.aria.desktop":
    "Upload a QR image. Drop it here or press Ctrl+V to paste.",
  "upload.dropzone.aria.mobile":
    "Upload a QR image from your gallery, or tap Paste image.",
  "upload.input.aria": "Upload QR image",
  "upload.camera.title": "Open the camera to capture a DuitNow QR",
  "upload.camera.hint": "The photo will be used to decode the QR",
  "upload.camera.input.aria": "Take QR photo",
  "upload.list.count": "{n}/10 images",
  "upload.list.hide": "Hide",
  "upload.list.show": "Show",
  "upload.list.clearAll.aria": "Remove all",
  "upload.list.section.done": "Done ({n})",
  "upload.list.section.failed": "Failed ({n})",
  "upload.item.status.idle": "Ready",
  "upload.item.status.decoding": "Decoding",
  "upload.item.status.processing": "Processing",
  "upload.item.status.done": "Done",
  "upload.item.status.errorFallback": "Decode failed.",
  "upload.item.remove.aria": "Remove file",
  "upload.item.preview.aria": "Preview {fileName}",
  "upload.toast.dragImagesOnly":
    "Drop image files only (JPG, PNG, HEIC, and similar).",
  "upload.toast.noClipboardImage": "No image in the clipboard",
  "upload.toast.clipboardDenied.title": "Permission denied",
  "upload.toast.clipboardDenied.description":
    "Allow clipboard access, or pick an image from your gallery.",
  "upload.toast.pasteUnsupported.title": "Paste image not supported",
  "upload.toast.pasteUnsupported.description":
    "This browser may not support pasting images. Pick one from your gallery instead.",
  "upload.toast.unsupportedFormat":
    "Unsupported file format. Use JPG, PNG, or HEIC.",
  "upload.toast.batchLimit":
    "Maximum {n} files. Some files were not added.",
  "upload.toast.decodeSuccess": "{n} QR codes detected and processed.",

  // result
  "result.region.aria": "QR results",
  "result.title": "QR ready to use",
  "result.description": "Scan with your bank app to pay",
  "result.config.aria": "Set QR design",
  "result.config.ariaSingle": "Export settings",
  "result.alert.dismiss.aria": "Hide warning",
  "result.alert.title": "Before you scan:",
  "result.alert.item.verifyName": "Confirm the recipient name is correct",
  "result.alert.item.checkAmount": "Check the payment amount if shown",
  "result.alert.item.untrustedSource":
    "Do not scan QR codes from sources you do not trust",
  "result.preview.aria": "QR preview",
  "result.qr.title": "DuitNow QR — Scan to pay",
  "result.qr.alt": "DuitNow QR — Scan to pay",
  "result.qr.altNamed": "DuitNow QR — {name}",
  "result.qr.altFallbackName": "Scan to pay",
  "result.hint.saveHold":
    "Save, share, or press and hold the QR above to save",
  "result.downloadAll": "Download ({n})",
  "result.item.preview.aria": "QR preview — {name}",

  // export
  "export.settings.title": "Export settings",
  "export.settings.description": "Choose the QR design and image size",
  "export.settings.skipPrompt": "Don't show again",
  "export.settings.next": "Next",
  "export.form.layout.label": "Export format",
  "export.form.layout.duitnow": "DuitNow",
  "export.form.layout.plain": "QR only",
  "export.form.layout.plainHint":
    "No recipient or bank name on the image. White background, 1:1 ratio.",
  "export.form.style.label": "QR style",
  "export.form.style.classic": "Square",
  "export.form.style.rounded": "Rounded",
  "export.form.showBankName": "Show bank name",
  "export.form.bg.label": "Background",
  "export.form.bg.white": "White",
  "export.form.bg.transparent": "Transparent",
  "export.form.ratio.label": "Image size",
  "export.form.ratio.1_1": "1:1",
  "export.form.ratio.3_4": "3:4",
  "export.action.download": "Download",
  "export.sheet.title": "Save QR",
  "export.sheet.description": "Save or share your QR",
  "export.sheet.save": "Save",
  "export.sheet.share": "Share",
  "export.toast.copyFail.title": "Couldn't copy",
  "export.toast.copyFail.description": "Try downloading instead.",
  "export.toast.shareFail.title": "Couldn't share",
  "export.toast.shareFail.description": "Try downloading instead.",
  "export.toast.copied": "QR copied to clipboard.",
  "export.toast.shared": "QR shared.",
  "export.toast.downloaded": "QR downloaded.",
  "export.toast.zipDownloaded": "{n} QR codes downloaded as a ZIP.",
  "export.toast.renderFail": "Couldn't generate the QR. Try again.",
  "export.toast.zipFail": "Couldn't create the ZIP. Try again.",
  "export.toast.nothingToDownload": "No QR images to download.",
  "export.error.shareUnsupported":
    "Sharing images isn't supported on this device.",
  "export.error.copyUnsupported":
    "Copying images isn't supported. Try downloading instead.",
  "export.canvas.nationalQr": "MALAYSIA NATIONAL QR",
  "export.canvas.watermark": "tukarqr.my",
  "export.shareQr.title": "DuitNow QR",

  // onboarding
  "onboarding.howTo.title": "How to use",
  "onboarding.howTo.description":
    "Follow these steps to convert your DuitNow QR",
  "onboarding.howTo.step1.title": "Upload or take a photo",
  "onboarding.howTo.step1.description":
    "Upload a DuitNow QR photo or capture one with your device camera.",
  "onboarding.howTo.step2.title": "Decode and verify",
  "onboarding.howTo.step2.description":
    "We'll decode it and confirm it's a valid Malaysia DuitNow payment QR.",
  "onboarding.howTo.step3.title": "Download or copy",
  "onboarding.howTo.step3.description":
    "Download the clear QR image or copy it to your clipboard.",
  "onboarding.howTo.next": "Next",
  "onboarding.privacy.title": "Privacy",
  "onboarding.privacy.description":
    "How privacy and data processing work",
  "onboarding.privacy.point1":
    "All QR processing happens in your browser. No data or images are sent to a server.",
  "onboarding.privacy.point2":
    "This tool runs entirely in your browser to decode and generate QR codes.",
  "onboarding.privacy.point3":
    "No third-party analytics scripts are required for core features.",
  "onboarding.privacy.done": "Got it",

  // rating
  "rating.modal.title": "How was your experience?",
  "rating.modal.description":
    "Rate Tukar QR so we can keep improving it.",
  "rating.stars.aria": "Rate your experience",
  "rating.stars.defaultAria": "Star rating",
  "rating.stars.starN.aria": "{n} stars",
  "rating.feedback.label": "What can we improve?",
  "rating.feedback.placeholder": "Tell us about a problem or idea...",
  "rating.feedback.minLength": "Enter at least {n} characters.",
  "rating.feedback.submit": "Send feedback",
  "rating.feedback.submitting": "Sending...",
  "rating.thanks": "Thanks for your feedback!",
  "rating.share": "Share with a friend",
  "rating.toast.submitFail.title": "Couldn't send rating",
  "rating.toast.feedbackFail.title": "Couldn't send feedback",
  "rating.toast.webhookMissing":
    "Rating webhook isn't configured. Check NEXT_PUBLIC_DISCORD_RATING_WEBHOOK_URL.",
  "rating.toast.retry": "Try again in a moment.",

  // about
  "about.heading": "About Tukar QR",
  "about.intro":
    "Tukar QR is a free tool that turns blurry, unclear, or camera-captured DuitNow QR photos into clean digital QR codes you can scan again for payment.",
  "about.openSource.heading": "Open source and transparent",
  "about.openSource.body":
    "Tukar QR's source code is on GitHub. You can review the implementation, help improve the project, or report issues. The star badge reflects community support for this open repository — a sign the tool is built in the open and can be trusted.",
  "about.openSource.stars": "Stars",
  "about.openSource.sponsor": "Become Sponsor",
  "about.hero.beforeAlt": "Original physical QR — blurry and hard to scan",
  "about.hero.afterAlt": "Digital QR after conversion — clear and clean",

  // accordion
  "accordion.howItWorks.title": "How it works",
  "accordion.howItWorks.p1": "The process is short and simple.",
  "accordion.howItWorks.p2":
    "Upload a QR photo or use your device camera to scan an existing DuitNow QR. The tool decodes the payment details and regenerates a clear digital QR code.",
  "accordion.howItWorks.step1":
    "Upload a DuitNow QR photo or scan it with your camera.",
  "accordion.howItWorks.step2":
    "The system decodes and verifies it as a valid Malaysia DuitNow payment QR.",
  "accordion.howItWorks.step3":
    "A clear digital QR is regenerated and ready to download or copy.",
  "accordion.security.title": "Security and privacy",
  "accordion.security.body":
    "All processing happens entirely in your browser. No data, images, or payment details are sent to any server. Uploaded images are not stored, logged, or shared with third parties. Once you close the page, nothing remains.",
  "accordion.validation.title": "DuitNow QR validation",
  "accordion.validation.body":
    "Tukar QR only supports valid Malaysia DuitNow payment QR codes. It checks the EMVCo format, Malaysia country code (MY), and the DuitNow Application Identifier (AID) before regenerating a QR. Non-DuitNow or damaged codes are rejected automatically.",
  "accordion.why.title": "Why Tukar QR exists",
  "accordion.why.p1":
    "Many people in Malaysia keep DuitNow QR photos in their phone gallery for later — recurring payments, sharing an account number, or a quick reference. But photos taken with a camera or screenshot often end up blurry, broken, or hard to scan again.",
  "accordion.why.p2":
    "Tukar QR solves that. Anyone can regenerate a clear, clean digital QR from an existing photo — without asking for a new QR.",
  "accordion.why.suitableHeading": "Tukar QR is useful for:",
  "accordion.why.audience.personal.title": "Personal use",
  "accordion.why.audience.personal.text":
    "Save and regenerate DuitNow QR photos from your gallery into high-quality QR codes.",
  "accordion.why.audience.business.title": "Business owners",
  "accordion.why.audience.business.text":
    "Turn a blurry shop QR photo into a digital QR you can print clearly again.",
  "accordion.why.audience.seller.title": "Marketplace sellers",
  "accordion.why.audience.seller.text":
    "Prepare a clean payment QR for customers on social platforms.",
  "accordion.why.audience.designer.title": "Designers and developers",
  "accordion.why.audience.designer.text":
    "Get a digital QR for designs, apps, or marketing materials.",
  "accordion.why.audience.anyone.title": "Anyone",
  "accordion.why.audience.anyone.text":
    "Who has a DuitNow QR photo in their gallery and wants a clear, reusable QR.",
  "accordion.banks.title":
    "Banks and financial institutions that support DuitNow QR",
  "accordion.banks.body":
    "DuitNow QR is supported by many banks and financial institutions in Malaysia. See the full list to check whether your bank is included.",
  "accordion.banks.cta": "View full list",
  "accordion.disclaimer.title": "Disclaimer",
  "accordion.disclaimer.p1":
    "Tukar QR is an independent tool and is not affiliated with, endorsed by, or sponsored by Payments Network Malaysia Sdn Bhd (PayNet), DuitNow, or any financial institution. DuitNow and the DuitNow logo are registered trademarks of PayNet.",
  "accordion.disclaimer.p2":
    "This tool only helps convert blurry QR photos into clear digital QR codes. You are fully responsible for verifying recipient details and payment amounts before any transaction. Tukar QR is not liable for losses or incorrect transactions.",
  "accordion.disclaimer.p3":
    "Do not use this tool for fraud, forgery, or any illegal activity.",
  "accordion.feedback.before":
    "For feedback, suggestions, or reports, email",

  // list
  "list.title":
    "Banks and financial institutions that support DuitNow QR in Malaysia.",
  "list.table.no": "No",
  "list.table.name": "Name",
  "list.showAll": "Show all ({n})",
  "list.showLess": "Show less",
  "list.source.label": "Source:",
  "list.source.link": "Paynet",

  // errors
  "errors.decode.tooLargeSize":
    "Image is too large. Maximum file size is 30MB.",
  "errors.decode.tooLargeResolution":
    "Image is too large. Maximum resolution is 4096px per side.",
  "errors.decode.unsupportedFormat":
    "Unsupported image format. Use JPG, PNG, or HEIC.",
  "errors.decode.corruptFile":
    "The image file is damaged or unreadable. Try another file.",
  "errors.decode.noQr":
    "No QR code found in this image. Make sure the image shows a clear QR code.",
  "errors.decode.blurry":
    "The QR image is unclear or blurry. Take a clearer photo.",
  "errors.duitnow.invalidFormat":
    "Invalid DuitNow QR format. The code may be damaged or not a payment DuitNow QR.",
  "errors.duitnow.notDuitNow":
    "This is not a DuitNow payment QR. Only Malaysia DuitNow QR codes are supported.",
  "errors.duitnow.invalidOrCorrupt":
    "The DuitNow QR is invalid or damaged.",
  "errors.duitnow.invalidOrCorruptHint":
    "The DuitNow QR is invalid or damaged. Upload a clearer QR image.",
  "errors.duitnow.invalidFormatHint":
    "Invalid DuitNow QR format. The code may be damaged or not a payment DuitNow QR. Upload a clearer QR image.",

  // share
  "share.app.title": "TukarQR",
  "share.app.text":
    "Turn blurry DuitNow QR photos into clear images — free, right in your browser.",
  "share.app.linkCopied": "Link copied to clipboard.",
  "share.app.copyFail": "Couldn't copy the link to the clipboard.",

  // a11y
  "a11y.imagePreview.defaultAlt": "Image preview",
  "a11y.imagePreview.closeHint": "Click outside or press Escape to close",

  // notFound
  "notFound.code": "404",
  "notFound.message": "Page not found.",
  "notFound.cta": "Back to Tukar QR",
};
