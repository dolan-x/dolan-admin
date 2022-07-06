import type { FC } from "react";
import { Link } from "react-router-dom";
import { useAsyncEffect } from "use-async-effect";
import { Badge, Button, Card, Dropdown, Pagination, Popconfirm, Table, Tag, Toast } from "@douyinfe/semi-ui";
import type { Tag as DolanTag, Post } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import { toDisplayDate } from "~/utils";
import { Loading } from "~/components/Dash/Common";

type WithKeyPost = (Post & { key: string });

const statusMapping = {
  published: <Badge dot className="!bg-$semi-color-success" />,
  draft: <Badge dot type="danger" />,
};

function processPosts (posts: Post[]) {
  return posts.map(p => ({
    ...p,
    key: p.slug,
  }));
}

const Posts: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<WithKeyPost[]>([]);
  const [metas, setMetas] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPostSlugs, setSelectedPostSlugs] = useState<string[]>([]);
  const [enableBatchOperation, setEnableBatchOperation] = useState(false);
  const [showBatchOperationMenu, setShowBatchOperationMenu] = useState(false);

  const toggleShowBatchOperationMenu = () => { setShowBatchOperationMenu(!showBatchOperationMenu); };

  async function onFetch () {
    const resp = await fetchApi("posts", {
      params: {
        page: currentPage,
      },
    });
    if (resp.success) {
      setPosts(processPosts(resp.data));
      setMetas(resp.metas);
    } else { Toast.error(t("pages.posts.failed")); }
    setLoading(false);
  }

  useAsyncEffect(onFetch, [currentPage]);

  // Batch Operations
  // TODO: use PATCH

  async function convertTo (postSlugs: string[], status: "published" | "draft") {
    setLoading(true);
    Toast.info({
      content: `Converting to ${status}...`,
    });
    await Promise.all(
      postSlugs.map(async (s, i) => {
        fetchApi(`posts/${s}`, {
          method: "PUT",
          body: {
            ...posts[i],
            status,
          },
        });
      }),
    );
    // TODO: 直接onFetch()会导致数据不更新/不完全，不清楚原因
    setTimeout(() => onFetch(), 1000);
  }

  async function convertToPublished () {
    await convertTo(selectedPostSlugs, "published");
  }

  async function convertToDraft () {
    await convertTo(selectedPostSlugs, "draft");
  }

  async function deletePosts () {
    setLoading(true);
    Toast.info({
      content: "Deleting...",
    });
    await Promise.all(
      selectedPostSlugs.map(async (s) => {
        fetchApi(`posts/${s}`, {
          method: "DELETE",
        });
      }),
    );
    // TODO
    setTimeout(() => onFetch(), 1000);
  }

  function onPageChange (currentPage: number) {
    setCurrentPage(currentPage);
    setLoading(true);
  }

  function onRowSelectionChange (selectedRowKeys: string[] | undefined) {
    setEnableBatchOperation(selectedRowKeys?.length !== 0);
    setSelectedPostSlugs(selectedRowKeys || []);
  }

  function renderTitle (title: string, item: Post) {
    return (
      <div className="text-blue-400">
        <Link to={`./edit/${item.slug}`}>
          {item.sticky
            ? <div className="text-red-600 h-4 i-carbon-pin" />
            : null}
          &nbsp;
          {title || t("pages.posts.no-title")}
        </Link>
      </div>
    );
  }

  function renderStatus (status: Post["status"]) {
    if (!(status in statusMapping)) { return null; }
    return (
      <>
        {statusMapping[status as keyof typeof statusMapping]}
        &nbsp;
        {t(`pages.posts.status.${status}`)}
      </>
    );
  }

  function renderTags (tags: DolanTag[]) {
    return (
      <div>
        {tags.length !== 0
          ? tags.map((tag) => {
            return (
              <Tag key={tag.slug}>
                {tag.name}
              </Tag>
            );
          })
          : t("pages.posts.no-tags")}
      </div>
    );
  }

  function renderCreatedDate (publishedDate: Post["created"]) {
    return (
      <div>
        {toDisplayDate(publishedDate)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3">
        <Link to="./new">
          <Button className="mb-4" theme="solid" type="primary">
            {t("pages.posts.new-post")}
          </Button>
        </Link>
        <Dropdown
          trigger={enableBatchOperation ? "click" : "custom"}
          visible={showBatchOperationMenu}
          onVisibleChange={setShowBatchOperationMenu}
          menu={[
            { node: "item", name: "转为发布", onClick: convertToPublished },
            { node: "item", name: "转为草稿", onClick: convertToDraft },
            { node: "divider" },
            { node: "item", name: "删除", type: "danger", onClick: deletePosts },
          ]}
          render={(
            <Dropdown.Menu>
              <Dropdown.Item onClick={convertToPublished}>
                {t("pages.posts.convert-to-published")}
              </Dropdown.Item>
              <Dropdown.Item onClick={convertToDraft}>
                {t("pages.posts.convert-to-draft")}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Popconfirm title={t("pages.posts.confirm-delete")} onConfirm={deletePosts}>
                <Dropdown.Item type="danger">
                  {t("pages.posts.delete")}
                </Dropdown.Item>
              </Popconfirm>
            </Dropdown.Menu>
          )}
        >
          <Button className="mb-4" type="tertiary" disabled={!enableBatchOperation} onClick={toggleShowBatchOperationMenu}>
            <div className="flex items-center gap-1">
              {t("pages.posts.batch-operation")}
              <div className="i-fluent-triangle-down-12-filled text-2" />
            </div>
          </Button>
        </Dropdown>
      </div>
      <Card>
        <Loading loading={loading}>
          <Table
            pagination={false}
            dataSource={posts}
            rowSelection={{
              selectedRowKeys: selectedPostSlugs,
              onChange: onRowSelectionChange as any,
            }}
          >
            <Table.Column title={t("pages.posts.title")} dataIndex="title" key="title" render={renderTitle} />
            <Table.Column title={t("pages.posts.status.label")} dataIndex="status" key="status" render={renderStatus} />
            <Table.Column title={t("pages.posts.tags")} dataIndex="tags" key="tags" render={renderTags} />
            <Table.Column title={t("pages.posts.created")} dataIndex="created" key="created" render={renderCreatedDate} />
          </Table>
          <div className="flex justify-center my-7">
            <Pagination currentPage={currentPage} onPageChange={onPageChange} total={metas.pages || 1} pageSize={1} />
          </div>
        </Loading>
      </Card>
    </div>
  );
};

export default Posts;
