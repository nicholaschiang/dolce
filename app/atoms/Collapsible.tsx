import {
  Root as CollapsibleMain,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible'

export const Collapsible = Object.assign(CollapsibleMain, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})
