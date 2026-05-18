export type SlideReference = {
  label: string;
  page: number;
};

function ref(page: number, endPage?: number): SlideReference {
  return {
    label: endPage && endPage !== page ? `Slides ${page}-${endPage}` : `Slide ${page}`,
    page,
  };
}

export const slideReferences: Record<string, Record<string, SlideReference>> = {
  xss: {
    "what-is-xss": ref(184),
    "xss-types": ref(185, 196),
    "xss-payloads": ref(187, 198),
    "xss-bypass": ref(199, 200),
    "xss-context": ref(184, 196),
    "xss-mitigation": ref(199, 200),
  },
  steganography: {
    "steg-intro": ref(226, 229),
    "steg-techniques": ref(231, 249),
    "steg-tools": ref(245, 250),
    "steg-detection": ref(237, 250),
  },
  "forensics-foundations": {
    acpo: ref(278, 280),
    "evidence-types": ref(260, 267),
    "order-volatility": ref(365, 366),
    "chain-custody": ref(281, 282),
    acquisition: ref(354, 363),
    locard: ref(262, 267),
  },
  "forensics-filesystems": {
    ntfs: ref(388, 390),
    fat: ref(398, 399),
    macb: ref(395, 402),
    mft: ref(389, 390),
    "slack-space": ref(379, 380),
    timezone: ref(398, 401),
  },
  "forensics-deleted": {
    "how-deletion-works": ref(385, 405),
    "mft-recovery": ref(404, 405),
    "file-carving": ref(406, 407),
    ads: ref(408),
    "zone-identifier": ref(409),
    "recycle-bin": ref(410, 413),
    vss: ref(414, 415),
  },
  registry: {
    "registry-intro": ref(416, 419),
    "root-keys": ref(420, 421),
    "data-types": ref(422),
    hives: ref(423, 424),
    "forensic-value": ref(419, 432),
    "guids-sids": ref(425, 426),
    "usb-forensics": ref(427, 432),
    "registry-timestamps": ref(423, 424),
  },
  "event-logs": {
    "event-log-intro": ref(434, 436),
    "log-files": ref(437, 438),
    channels: ref(439, 440),
    "event-structure": ref(435, 438),
    "logon-events": ref(443, 444),
    "logon-types": ref(445, 446),
    "session-events": ref(447, 448),
    "clock-verification": ref(449, 452),
    limitations: ref(436, 452),
  },
  "forensics-reporting": {
    "analysis-vs-interpretation": ref(454),
    "5wh": ref(373, 374),
    attribution: ref(455),
    "golden-rule": ref(456),
    "report-structure": ref(457, 458),
    "plain-language": ref(457, 458),
    planning: ref(459, 461),
  },
  "pentest-methodology": {
    "pentest-intro": ref(306, 320),
    "ptes-phases": ref(307, 319),
    osint: ref(308, 310),
    scanning: ref(311, 312),
    exploitation: ref(313, 314),
    "post-exploitation": ref(315, 316),
    "responsible-disclosure": ref(489, 491),
  },
  "pentest-reporting": {
    "report-structure-pt": ref(470, 471),
    cvss: ref(479),
    "finding-format": ref(480, 488),
    "remediation-roadmap": ref(492),
    "patch-management": ref(493, 495),
  },
  "vuln-reference": {
    heartbleed: ref(477, 484),
    "tls-deprecated": ref(485),
    "http-headers": ref(486),
    "server-banner": ref(487),
    hsts: ref(488),
    pizzapineapple: ref(472, 493),
  },
};

export function getSlideReference(topicSlug: string, sectionId: string): SlideReference | undefined {
  return slideReferences[topicSlug]?.[sectionId];
}
