
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";


const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const ViewPatients=()=>{
  return(
      <Table className={'bg-white'}>
        <TableHeader>
          <TableRow className={'border-b border-[#eee] bg-gray-2 text-left dark:bg-meta-4'}>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Invoice</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Status</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Method</TableHead>
            <TableHead className={'min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11'}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className={"border-t border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{invoice.invoice}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{invoice.paymentStatus}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{invoice.paymentMethod}</TableCell>
                <TableCell className={"border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11"}>{invoice.totalAmount}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
  )
}
export default ViewPatients;
