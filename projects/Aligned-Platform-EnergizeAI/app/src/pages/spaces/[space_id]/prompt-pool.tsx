import { useState } from "react"

import { AddToPromptPool } from "@/components/prompt-pool/add-to-prompt-pool"
import { columns } from "@/components/prompt-pool/prompt-pool.columns"
import { OrgAdminLayout } from "@/components/spaces/settings/space-admin-layout"
import { TopicTreeMenu } from "@/components/topics/topic-tree-menu"
import { ClientDataTable } from "@/components/ui/client-data-table"
import { DataTable } from "@/components/ui/data-table"
import { SearchInput } from "@/components/ui/search-input"
import { SectionHeader } from "@/components/ui/section-header"
import { Separator } from "@/components/ui/separator"
import { energizeEngine } from "@/lib/energize-engine"
import useDebounce from "@/lib/use-debounce"
import useQueryState from "@/lib/use-query-state"
import { useRouter } from "next/router"

const OrgPromptPoolPage = () => {
  const { space_id } = useRouter().query
  const [topicId, setTopicId] = useState<string | null>(null)
  const [search, setSearch] = useQueryState<string | undefined>("search", {
    defaultValue: undefined,
  })
  const searchQuery = useDebounce(search, 500)

  const topics = energizeEngine.prompts.getPrompts.useQuery(
    {
      spaceId: space_id as string,
      topicId: topicId as string,
      search: searchQuery ?? null,
    },
    {
      enabled: !!topicId,
    },
  )

  return (
    <OrgAdminLayout>
      <div className="flex flex-col gap-4">
        <SectionHeader title="Prompt Pool" description="Manage the prompt pool for your topics">
          <TopicTreeMenu
            currentTopicId={topicId}
            handleNewTopicId={(topicId: string) => {
              setTopicId(topicId)
            }}
            className="max-w-sm flex-1 whitespace-nowrap"
          />
        </SectionHeader>
        <Separator />
        {!topicId ? (
          <div className="flex h-[50vh] w-full flex-col items-center justify-center border border-dashed">
            Hi there! Select a topic above to get started.
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
              <AddToPromptPool topicId={topicId} />
            </div>
            <ClientDataTable columns={columns} queryResults={topics} />
          </>
        )}
      </div>
    </OrgAdminLayout>
  )
}

export default OrgPromptPoolPage
