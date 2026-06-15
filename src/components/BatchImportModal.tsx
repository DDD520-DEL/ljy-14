import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react';
import { teamApi } from '../services/api';
import { useTeamStore } from '../store/useStore';
import type { ImportResult } from '../../shared/types';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BatchImportModal({ isOpen, onClose }: BatchImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchTeams } = useTeamStore();

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    setError(null);
    setResult(null);
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setError('文件格式不正确，请上传 .xlsx 或 .xls 文件');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB');
      return;
    }
    setFile(f);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const importResult = await teamApi.importTeams(file);
      setResult(importResult);
      if (importResult.successCount > 0) {
        await fetchTeams();
      }
    } catch (err) {
      setError('导入请求失败，请检查网络连接后重试');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      '舞队名称', '队长姓名', '联系电话', '成立日期', '队员人数', '所在区域', '舞蹈风格',
      '舞队简介', '活动公园名称', '公园纬度', '公园经度', '活动时间',
      '头像URL', '集体照URL', '服装照URL',
      '歌曲名称1', '歌手1', '曲风1', '时长1', '封面URL1',
      '歌曲名称2', '歌手2', '曲风2', '时长2', '封面URL2',
      '歌曲名称3', '歌手3', '曲风3', '时长3', '封面URL3'
    ];
    const sampleRow = [
      '朝阳广场舞队', '王大妈', '13800138000', '2020-01-15', 25, '朝阳区', '民族舞',
      '一支活力四射的广场舞队，多次获得区里比赛奖项', '朝阳公园', 39.941, 116.484, '每周一、三、五 19:00-21:00',
      '', '', '',
      '最炫民族风', '凤凰传奇', '流行', '3:45', '',
      '套马杆', '乌兰托娅', '民族', '4:10', '',
      '小苹果', '筷子兄弟', '流行', '3:30', ''
    ];
    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '舞队批量导入模板.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fadeInUp">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-orange-500" />
            批量导入舞队
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">📋 导入说明</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>支持 Excel 格式（.xlsx, .xls），文件大小不超过 10MB</li>
              <li>必填字段：舞队名称、队长姓名、联系电话、成立日期、队员人数、所在区域、舞蹈风格</li>
              <li>舞队名称不能重复，系统会自动跳过重复的舞队</li>
              <li>每支舞队最多可同时导入 10 首歌曲</li>
            </ul>
            <button
              onClick={handleDownloadTemplate}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              下载导入模板（CSV格式）
            </button>
          </div>

          {!result ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-orange-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {isDragging ? '松开鼠标上传文件' : '点击或拖拽文件到此处'}
                </p>
                <p className="text-sm text-gray-500">支持 .xlsx 或 .xls 格式</p>
              </div>

              {file && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-10 h-10 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setFile(null); setResult(null); setError(null); }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-gray-700">{result.totalCount}</p>
                  <p className="text-sm text-gray-500">总计</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{result.successCount}</p>
                  <p className="text-sm text-green-600">成功</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-red-600">{result.failCount}</p>
                  <p className="text-sm text-red-600">失败</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-yellow-600">{result.duplicateCount}</p>
                  <p className="text-sm text-yellow-600">重复</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      失败详情
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-600 font-medium">行号</th>
                          <th className="px-4 py-2 text-left text-gray-600 font-medium">舞队名称</th>
                          <th className="px-4 py-2 text-left text-gray-600 font-medium">错误信息</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {result.errors.map((err, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-gray-600">{err.row || '-'}</td>
                            <td className="px-4 py-2 text-gray-800">{err.name || '-'}</td>
                            <td className="px-4 py-2 text-red-600">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.successCount > 0 && result.failCount === 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">导入成功！</p>
                    <p className="text-sm text-green-700">共成功导入 {result.successCount} 支舞队</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          {!result ? (
            <>
              <button
                onClick={handleClose}
                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                disabled={!file || isImporting}
                className={`px-5 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  file && !isImporting
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isImporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    导入中...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    开始导入
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              关闭
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
