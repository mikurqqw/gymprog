# Offline food catalog

The catalog contains **729 records**: 584 directly imported USDA SR Legacy records, 51 original regional recipe models, four explicit regional estimates, and 90 compatibility records from the original app. Excluding all 90 compatibility records leaves **639 new entries**. It does not pad the count with repeated IDs, translations, spelling changes or arbitrary randomized nutrient values.

USDA selections represent distinct ingredients, cultivars, product forms and meaningful preparation states such as raw, cooked, dried, canned or fat content. Salt-only and vitamin-fortification-only variants are collapsed before export. The selection has 322 translated base names before the six explicitly selected flour/horse/carp/seasoning records. Different preparation states must remain distinguishable: 100 g dry rice is not interchangeable with 100 g cooked rice.

## Rebuild

Run from the repository root with Python 3.11+ and the standard library:

```powershell
python scripts/build-food-catalog.py
```

The builder downloads the official USDA archive only when the ignored authoring cache `artifacts/usda-sr-2018.zip` is absent. It verifies SHA-256 before reading. Building requires the cache or network access; the website does not fetch this archive or use a USDA API key. The checked-in JSON is sufficient for offline runtime initialization. `artifacts/food-untranslated-qualifiers.json` is an authoring report: unsupported description qualifiers are omitted rather than displayed as untranslated text.

Official archive: [USDA SR Legacy April 2018 CSV](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip).

SHA-256: `b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0`.

## Provenance and licensing

`src/data/food-sources.json` is an array of source records. Each catalog `sourceId` resolves to one record. Source titles, attribution and notes have Russian, Kazakh and English variants. Its four source IDs are:

| Source ID | Records | Provenance |
| --- | ---: | --- |
| `usda-sr-legacy-2018` | 584 | Real FDC IDs and original English descriptions; exact energy/protein/fat/carbohydrate values from the official archive. |
| `ironcycle-recipe-models` | 51 | Original ingredient/yield models with reproducible sums; all marked estimated. |
| `ironcycle-regional-estimates` | 4 | Explicitly authored assumptions for horse fat, camel milk, mare milk and kumys; all marked estimated. |
| `ironcycle-legacy-estimates` | 90 | Existing app values preserved without inventing external attribution; all marked estimated. |

[USDA's own licensing statement](https://fdc.nal.usda.gov/api-guide/) declares FoodData Central public domain under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Attribution: U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, SR Legacy (2018). The SR Legacy release is April 2018; FDC migration/publication dates in its metadata may differ. This is a versioned reference dataset, not a current product-label database.

New IronCycle translations, descriptive metadata and original recipe/composition models are dedicated to CC0 1.0 to the extent the contributors hold rights. Pre-existing numerical food estimates have no documented external provenance and are explicitly identified as estimates. This statement does not claim ownership of a third-party dataset or relicense protected material. No commercial recipe text, branded database export, image or paywalled dataset is copied into the catalog. Linked scientific reviews provide context only; their text or tables are not reproduced or relicensed.

## Nutrient semantics

All `kcal`, `p`, `f` and `c` values describe **100 g of the named edible product in the named state**. USDA nutrient IDs are 1008 (energy kcal), 1003 (protein g), 1004 (total lipid g), and 1005 (carbohydrate by difference g). USDA carbohydrate can include fiber; energy need not equal a simple 4/4/9 calculation. `estimated=false` only means direct source transcription, not certainty or a new laboratory analysis.

Every entry has translated names, language-specific aliases, a 100 g portion, allergens, vegetarian/halal metadata, a source ID and license. Recipe entries also offer a **modeled** 250 g serving. Portion weights are UI choices, not official serving-size recommendations. Aliases include the translated name and the original English description; this provides consistent multilingual search without pretending that every alias is a separate food.

The first 90 `food-0` through `food-89` IDs retain their original Russian/English names and every kcal/P/F/C value. Existing log references therefore retain their meaning. Their prior meal-selection tags are preserved; additional annotations only add information. Compatibility foods can overlap newer source entries but do not count toward the new-entry minimum.

## Regional recipes and uncertainty

The catalog includes beshbarmak (beef and horse), plov (beef and lamb), lagman, manty, kazy, baursak, kurt, shubat, kumys, kuyrdak, naryn, sorpa, zhent, talkan, shelpek, katama, samsa, zhaya, irimshik, aklak, kozhe and other CIS meals. Distinct names correspond to different ingredient or preparation models, not spelling variations.

These are **illustrative nutrition models**, not canonical traditional recipes or preparation instructions. `recipeIngredients` stores each ingredient ID and grams in its specified state; `recipeYieldGrams` stores an assumed final edible batch mass. For each macro:

```text
recipe value per 100 g = sum(ingredient value per 100 g × ingredient grams / final batch grams)
```

Water and evaporation are reflected only through the specified yield. Cooking losses, fermentation, fat absorption variability and micronutrient retention are not modeled. Several regional noodles use dry pasta as an explicit proxy. Kazy combines cooked horse meat with a generic modeled horse-fat ingredient. Kurt models concentration of Greek yogurt; shubat uses camel-milk composition as a proxy without simulating fermentation. Product labels, weighed recipes or laboratory data should replace these estimates when available.

Camel/mare milk composition and fermented drinks vary substantially. [The 2021 review of camelid/equid milk](https://www.mdpi.com/2624-862X/2/2/24) and [a review of camel milk](https://pmc.ncbi.nlm.nih.gov/articles/PMC10867071/) informed this uncertainty warning; the four authored regional values are not represented as exact numbers extracted from those papers. Kumys energy models 1.2 g alcohol per 100 g at 7 kcal/g alongside its P/F/C; actual alcohol content and energy can differ. No therapeutic or medical benefit is claimed.

## Translation and dietary annotations

Russian and Kazakh food names and qualifiers are machine-assisted translations. Each entry carries `translationReview: "machine-assisted; native speaker review required"`. A native Kazakh food-domain reviewer has not approved the catalog. Established loanwords/transliterations are retained for some uncommon varieties; these are not disguised English fallback strings.

Allergen and diet annotations are name/category/ingredient-based aids. `allergens: []` means no listed allergen was inferred, **not certified allergen-free**; contamination, processing aids and brand-specific ingredients are unknown. Buckwheat and eggplant are not mislabeled merely because their English names contain “wheat” or “egg”. Allergens of modeled recipes are the union of ingredient allergens.

`vegetarian` excludes explicitly tagged meat, fish and shellfish; dairy cheese production aids/rennet and cross-contamination are not known. `halal: suitable` indicates ingredients that appear suitable, `not-suitable` identifies explicit pork/alcohol, and `verify` requires label/supplier/certification review. Animal products, dairy and fermentation models use `verify` where relevant. These fields are not religious certification.

## Validation boundaries

The authoring checks verify unique IDs, source resolution, complete three-language fields, numeric/portion bounds, preservation of all 90 old macro records, exact USDA source transcription, and reproduction of recipe sums from stored ingredients/yields. The app additionally validates imported data with its runtime schema. These checks establish structural integrity and provenance; they cannot validate an individual's measured recipe, product-label accuracy, native-language quality or halal/allergen certification.
