import type { FC } from "react";
import { Link } from "react-router-dom";
import useAsyncEffect from "use-async-effect";
import { Button, Card, Dropdown, Pagination, Popconfirm, Table, Toast } from "@douyinfe/semi-ui";
import type { Page } from "@dolan-x/shared";

import { fetchApi } from "~/lib";
import { Loading } from "~/components/Dash/Common";

function processPages (pages: Page[]) {
  return pages.map(p => ({
    ...p,
    key: p.slug,
  }));
}

const Pages: FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<Page[]>([]);
  const [metas, setMetas] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSlugs, setSelectedPageSlugs] = useState<string[]>([]);
  const [enableBatchOperation, setEnableBatchOperation] = useState(false);
  const [showBatchOperationMenu, setShowBatchOperationMenu] = useState(false);

  const toggleShowBatchOperationMenu = () => { setShowBatchOperationMenu(!showBatchOperationMenu); };

  async function onFetch () {
    const resp = await fetchApi<Page[]>("pages", {
      params: {
        page: currentPage,
      },
    });
    if (resp.success) {
      setPages(processPages(resp.data));
      setMetas(resp.metas);
      // TODO
    } else { Toast.error(t("pages.pages.failed")); }
    setLoading(false);
  }

  useAsyncEffect(onFetch, [currentPage]);

  // Batch Operations
  // TODO: use PATCH

  async function deletePages () {
    setLoading(true);
    Toast.info({
      content: "Deleting...",
    });
    await Promise.allSettled(
      selectedPageSlugs.map(async (s) => {
        fetchApi(`pages/${s}`, {
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
    setSelectedPageSlugs(selectedRowKeys || []);
  }

  function renderTitle (title: string, item: Page) {
    return (
      <div className="text-blue-400">
        <Link to={`./edit/${item.slug}`}>
          {/* TODO: i18n */}
          {title || t("pages.pages.no-title")}
        </Link>
      </div>
    );
  }

  function renderHidden (hidden: boolean) {
    return (
      <div>
        {
          hidden ? <div className="i-carbon:checkmark" /> : <div className="i-carbon:close" />
        }
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex gap-3 flex-wrap">
        <Link to="./new">
          <Button className="mb-4" theme="solid" type="primary">
            {t("pages.pages.new-page")}
          </Button>
        </Link>
        <Dropdown
          trigger={enableBatchOperation ? "click" : "custom"}
          visible={showBatchOperationMenu}
          onVisibleChange={setShowBatchOperationMenu}
          render={(
            <Dropdown.Menu>
              {/* TODO: i18n */}
              <Popconfirm title={t("common.confirm-delete")} onConfirm={deletePages}>
                <Dropdown.Item type="danger">
                  {t("common.delete")}
                </Dropdown.Item>
              </Popconfirm>
            </Dropdown.Menu>
          )}
        >
          <Button className="mb-4" type="tertiary" disabled={!enableBatchOperation} onClick={toggleShowBatchOperationMenu}>
            <div className="flex items-center gap-1">
              {t("pages.pages.batch-operation")}
              <div className="i-fluent:triangle-down-12-filled text-2" />
            </div>
          </Button>
        </Dropdown>
      </div>
      <Card className="min-h-full">
        <Loading loading={loading}>
          <Table
            pagination={false}
            dataSource={pages}
            rowSelection={{
              selectedRowKeys: selectedPageSlugs,
              onChange: onRowSelectionChange as any,
            }}
          >
            <Table.Column title={t("pages.pages.title")} dataIndex="title" key="title" render={renderTitle} />
            <Table.Column title={t("pages.pages.hidden")} dataIndex="hidden" key="hidden" render={renderHidden} />
          </Table>
          <div className="flex justify-center my-7">
            <Pagination currentPage={currentPage} onPageChange={onPageChange} total={metas.pages || 1} pageSize={1} />
          </div>
        </Loading>
      </Card>
    </div>
  );
};

export default Pages;
