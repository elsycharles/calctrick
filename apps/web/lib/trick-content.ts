export interface MentalMathExample {
  readonly calculation: string;
  readonly route: string;
  readonly answer: string;
}

export interface MentalMathGuide {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly label: string;
  readonly formula: string;
  readonly introduction: string;
  readonly steps: readonly string[];
  readonly examples: readonly MentalMathExample[];
  readonly note: string;
  readonly calculatorQuery: string;
}

export const MENTAL_MATH_GUIDES: readonly MentalMathGuide[] = [
  {
    slug: "multiply-by-25",
    title: "How to multiply by 25 mentally",
    description:
      "Multiply by 25 in your head by dividing the other factor by 4 and multiplying by 100, with clear worked examples.",
    label: "Quarter of 100",
    formula: "n × 25 = (n ÷ 4) × 100",
    introduction:
      "Because 25 is one quarter of 100, a multiplication by 25 can often become a division by 4 followed by a multiplication by 100. It is especially fast when the other factor is divisible by 4.",
    steps: [
      "Check whether the other factor is easy to divide by 4.",
      "Divide that factor by 4.",
      "Multiply the result by 100 by appending two zeros.",
    ],
    examples: [
      { calculation: "24 × 25", route: "(24 ÷ 4) × 100", answer: "600" },
      { calculation: "36 × 25", route: "(36 ÷ 4) × 100", answer: "900" },
      { calculation: "52 × 25", route: "(52 ÷ 4) × 100", answer: "1,300" },
    ],
    note: "If the factor is not divisible by 4, you can still multiply it by 100 and divide the result by 4. Choose the order that feels easiest for the number in front of you.",
    calculatorQuery: "?a=24&op=mul&b=25",
  },
  {
    slug: "multiply-by-11",
    title: "How to multiply by 11 mentally",
    description:
      "Learn a reliable mental method for multiplying any number by 11 by adding one ten-times copy and one original copy.",
    label: "Ten copies plus one",
    formula: "n × 11 = (n × 10) + n",
    introduction:
      "Eleven is 10 + 1. Instead of recalling a special rule, make one copy ten times larger and add the original number. This works for every number and stays easy to verify.",
    steps: [
      "Multiply the number by 10.",
      "Keep one unchanged copy of the original number.",
      "Add both values.",
    ],
    examples: [
      { calculation: "23 × 11", route: "230 + 23", answer: "253" },
      { calculation: "47 × 11", route: "470 + 47", answer: "517" },
      { calculation: "125 × 11", route: "1,250 + 125", answer: "1,375" },
    ],
    note: "For two-digit numbers you may know the shortcut of adding the middle digits. The 10 + 1 method is slightly longer, but it handles carries and larger numbers without changing the rule.",
    calculatorQuery: "?a=47&op=mul&b=11",
  },
  {
    slug: "divide-by-5",
    title: "How to divide by 5 mentally",
    description:
      "Divide by 5 quickly by doubling the number and then dividing by 10, with practical examples and decimal results.",
    label: "Double, then divide by 10",
    formula: "n ÷ 5 = (n × 2) ÷ 10",
    introduction:
      "Dividing by 5 is equivalent to multiplying by 2 and dividing by 10. Doubling is usually simple, and the final division only moves the decimal point one place to the left.",
    steps: [
      "Double the number being divided.",
      "Divide that result by 10.",
      "Keep the decimal when the division is not a whole number.",
    ],
    examples: [
      { calculation: "85 ÷ 5", route: "170 ÷ 10", answer: "17" },
      { calculation: "240 ÷ 5", route: "480 ÷ 10", answer: "48" },
      { calculation: "37 ÷ 5", route: "74 ÷ 10", answer: "7.4" },
    ],
    note: "This method works for whole numbers and decimals. When doubling a decimal is easier than doing long division, it is often the quickest route.",
    calculatorQuery: "?a=85&op=div&b=5",
  },
  {
    slug: "multiply-by-99",
    title: "How to multiply by 99 mentally",
    description:
      "Multiply by 99 by multiplying by 100 first and subtracting one original copy, with step-by-step examples.",
    label: "One less than 100",
    formula: "n × 99 = (n × 100) − n",
    introduction:
      "Ninety-nine is one less than 100. Create 100 copies of the number, then remove one copy. The round intermediate value makes the subtraction easier to see and check.",
    steps: [
      "Multiply the number by 100.",
      "Subtract the original number once.",
      "Check that the answer is slightly smaller than the ×100 result.",
    ],
    examples: [
      { calculation: "8 × 99", route: "800 − 8", answer: "792" },
      { calculation: "24 × 99", route: "2,400 − 24", answer: "2,376" },
      { calculation: "125 × 99", route: "12,500 − 125", answer: "12,375" },
    ],
    note: "The same compensation idea works near other round numbers: ×19 can become ×20 minus one copy, and ×101 can become ×100 plus one copy.",
    calculatorQuery: "?a=24&op=mul&b=99",
  },
];

export function getMentalMathGuide(slug: string): MentalMathGuide | undefined {
  return MENTAL_MATH_GUIDES.find((guide) => guide.slug === slug);
}
