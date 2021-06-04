import { Base64 } from 'js-base64'
import * as sourcegraph from 'sourcegraph'

export const linkURL = 'https://docs.sourcegraph.com/code_intelligence/explanations/precise_code_intelligence'

// Aggregable badges
//
// These indicators are the new hotness, and are tagged on each result that we send
// back (except for LSP as we're still trying to sunset all of that related code).
// These will be displayed aggregated at the file level to determine result precision.

export const semanticBadge: sourcegraph.AggregableBadge = {
    text: 'semantic',
    linkURL,
    hoverMessage: "This data comes from a pre-computed semantic index of this project's source.",
}

export const searchBasedBadge: sourcegraph.AggregableBadge = {
    text: 'search-based',
    linkURL,
    hoverMessage: 'This data is generated by a heuristic text-based search.',
}

export const partialHoverNoDefinitionBadge: sourcegraph.AggregableBadge = {
    text: 'partial semantic',
    linkURL,
    hoverMessage:
        'It looks like this symbol is defined in another repository that does not have a pre-computed semantic index. Go to definition may be imprecise.',
}

export const partialDefinitionNoHoverBadge: sourcegraph.AggregableBadge = {
    text: 'partial semantic',
    linkURL,
    hoverMessage:
        'It looks like this symbol is defined in another repository that does not have a pre-computed semantic index. This hover text may be imprecise.',
}

// Hover Alerts
//
// These alerts are displayed within the hover overlay and are emitted only for the
// first result (to avoid duplication). These alerts are generally dismissible and
// show only redundant information that is also present in the aggregable badges.
// We send more data than necessary here to support an old format that only affects
// instances older than 3.26.
//
// Once we no longer support this old format, we can remove the extra field and
// collapse some identically-rendered alerts (tooltip text and links are ignored).

const makeAlert = ({
    message,
    hoverMessage,
    type,
}: {
    message: string
    hoverMessage?: string
    type?: string
}): sourcegraph.Badged<sourcegraph.HoverAlert> => {
    const legacyFields = {
        badge: { kind: 'info' as const, linkURL, hoverMessage },
    }

    return {
        type,
        iconKind: 'info',
        summary: {
            kind: sourcegraph.MarkupKind.Markdown,
            value: `${message}<br /> [Learn more about precise code intelligence](${linkURL})`,
        },
        ...legacyFields,
    }
}

export const lsif = makeAlert({
    type: 'LSIFAvailableNoCaveat',
    message: 'Semantic result.',
    hoverMessage:
        "This data comes from a pre-computed semantic index of this project's source. Click to learn how to add this capability to all of your projects!",
})

export const lsifPartialHoverOnly = makeAlert({
    type: 'LSIFAvailableNoCaveat',
    message: 'Partial semantic result.',
    hoverMessage:
        'It looks like this symbol is defined in another repository that does not have a pre-computed semantic index. Click to learn how to make these results precise by enabling semantic indexing for that project.',
})

export const lsifPartialDefinitionOnly = makeAlert({
    type: 'LSIFAvailableNoCaveat',
    message: 'Partial semantic result.',
    hoverMessage:
        'It looks like this symbol is defined in another repository that does not have a pre-computed semantic index. Click to learn how to make these results precise by enabling semantic indexing for that project.',
})

// Note: non-dismissable
export const lsp = makeAlert({
    message: 'Language server result.',
    hoverMessage:
        'This data comes from a language server running in the cloud. Click to learn how to improve the reliability of this result by enabling semantic indexing.',
})

// Note: non-dismissable
export const searchLSIFSupportRobust = makeAlert({
    message: 'Search-based result.',
    hoverMessage:
        'This data is generated by a heuristic text-based search. Click to learn how to make these results precise by enabling semantic indexing for this project.',
})

export const searchLSIFSupportExperimental = makeAlert({
    type: 'SearchResultExperimentalLSIFSupport',
    message: 'Search-based result.',
    hoverMessage:
        "This data is generated by a heuristic text-based search. Existing semantic indexers for this language aren't totally robust yet, but you can click here to learn how to give them a try.",
})

export const searchLSIFSupportNone = makeAlert({
    type: 'SearchResultNoLSIFSupport',
    message: 'Search-based result.',
})

// Badge indicators
//
// These indicators were deprecated in 3.26, but we still need to send them back
// from the extensions as we don't know how old the instance we're interfacing
// with is and they might not have the code to display the new indicators.

const rawInfoIcon = (color: string): string => `
    <svg xmlns='http://www.w3.org/2000/svg' style="width:24px;height:24px" viewBox="0 0 24 24" fill="${color}">
        <path d="
            M11,
            9H13V7H11M12,
            20C7.59,
            20 4,
            16.41 4,
            12C4,
            7.59 7.59,
            4 12,
            4C16.41,
            4 20,
            7.59 20,
            12C20,
            16.41 16.41,
            20 12,
            20M12,
            2A10,
            10 0 0,
            0 2,
            12A10,
            10 0 0,
            0 12,
            22A10,
            10 0 0,
            0 22,
            12A10,
            10 0 0,
            0 12,
            2M11,
            17H13V11H11V17Z"
        />
    </svg>
`

const infoIcon = (color: string): string =>
    `data:image/svg+xml;base64,${Base64.encode(
        rawInfoIcon(color)
            .split('\n')
            .map(line => line.trimStart())
            .join(' ')
    )}`

/**
 * This badge is placed on all results that come from search-based providers.
 */
export const impreciseBadge = {
    kind: 'info',
    icon: infoIcon('#ffffff'),
    light: { icon: infoIcon('#000000') },
    hoverMessage:
        'Search-based results - click to see how these results are calculated and how to get precise intelligence with LSIF.',
    linkURL: 'https://docs.sourcegraph.com/code_intelligence/explanations/basic_code_intelligence',
}
